import { Router } from "express";
import { pool } from "../db/db";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const STATUS = {
  OPEN: "OPEN",
  LOCKED: "LOCKED",
  CHARGED: "CHARGED",
  FAILED: "FAILED",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

async function recomputeGroup(groupId: string) {
  const gRes = await pool.query(`SELECT id, "minParticipants", status FROM groups WHERE id=$1`, [groupId]);
  if ((gRes.rowCount ?? 0) === 0) throw new Error("Group not found");

  const g = gRes.rows[0] as { id: string; minParticipants: number; status: Status };

  const cRes = await pool.query(`SELECT COUNT(*)::int AS cnt FROM group_members WHERE group_id=$1`, [groupId]);
  const cnt = Number(cRes.rows[0]?.cnt ?? 0);
  const min = Number(g.minParticipants ?? 0);

  const nextStatus: Status =
    g.status === STATUS.CHARGED ? STATUS.CHARGED : cnt >= min ? STATUS.LOCKED : STATUS.OPEN;

  const progress = min > 0 ? Math.min(100, Math.round((cnt * 100) / min)) : 0;

  await pool.query(
    `
    UPDATE groups
    SET "joinedCount"=$2, progress=$3, status=$4
    WHERE id=$1
    `,
    [groupId, cnt, progress, nextStatus]
  );

  return { cnt, min, nextStatus, progress };
}

/**
 * GET /v1/groups
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM groups ORDER BY "createdAt" DESC NULLS LAST, id DESC LIMIT 50`
    );
    return res.json({ items: result.rows });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load groups" });
  }
});

/**
 * GET /v1/groups/my
 */
router.get("/my", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;

  try {
    const r = await pool.query(
      `
      SELECT
        g.*,
        p.name AS "productName",
        p."priceRegular" AS "priceRegular",
        p."priceGroup" AS "priceGroup"
      FROM groups g
      INNER JOIN group_members gm ON gm.group_id = g.id
      LEFT JOIN products p ON p.id = g."productId"
      WHERE gm.user_id = $1
      ORDER BY g."createdAt" DESC NULLS LAST
      `,
      [userId]
    );

    return res.json({ items: r.rows });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load my groups" });
  }
});

/**
 * GET /v1/groups/:id
 * returns item + isJoined + canPay
 */
router.get("/:id", authMiddleware, async (req, res) => {
  const groupId = req.params.id;
  const userId = (req as AuthRequest).user!.id;

  try {
    // always recompute so status/canPay is correct
    await recomputeGroup(groupId);

    const result = await pool.query(
      `
      SELECT g.*,
        EXISTS(
          SELECT 1 FROM group_members gm
          WHERE gm.group_id = g.id AND gm.user_id = $2
        ) AS "isJoined"
      FROM groups g
      WHERE g.id = $1
      `,
      [groupId, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Group not found" });

    const row: any = result.rows[0];
    const joinedCount = Number(row.joinedCount ?? 0);
    const min = Number(row.minParticipants ?? 0);
    const status = row.status as Status;

    row.canPay = Boolean(row.isJoined) && status === STATUS.LOCKED && joinedCount >= min;

    return res.json({ item: row });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load group" });
  }
});

/**
 * POST /v1/groups/:id/join
 */
router.post("/:id/join", authMiddleware, async (req, res) => {
  const groupId = req.params.id;
  const userId = (req as AuthRequest).user!.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const exists = await client.query(
      `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2`,
      [groupId, userId]
    );
    if ((exists.rowCount ?? 0) > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "User already joined this group" });
    }

    // ✅ המשתמש מצטרף לקבוצה
    await client.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1,$2)`,
      [groupId, userId]
    );

    await client.query("COMMIT");

    // 🔁 עדכון progress / status
    await recomputeGroup(groupId);

    // 🔔 HERE — יצירת Notification
    await pool.query(
      `
      INSERT INTO notifications (user_id, type, title, body, link)
      VALUES ($1, 'GROUP_JOIN', 'Joined group ✅', $2, $3)
      `,
      [userId, `You joined group ${groupId}`, `/groups/${groupId}`]
    );

    return res.json({ ok: true });
  } catch (e: any) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    return res.status(400).json({ error: e?.message ?? "Join failed" });
  } finally {
    client.release();
  }
});


/**
 * DELETE /v1/groups/:id/leave
 * cannot leave if LOCKED or CHARGED
 */
router.delete("/:id/leave", authMiddleware, async (req, res) => {
  const groupId = req.params.id;
  const userId = (req as AuthRequest).user!.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const gRes = await client.query(`SELECT status FROM groups WHERE id=$1 FOR UPDATE`, [groupId]);
    if ((gRes.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Group not found" });
    }

    const status = gRes.rows[0].status as Status;
    if (status === STATUS.LOCKED || status === STATUS.CHARGED) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cannot leave a locked or paid group" });
    }

    const del = await client.query(
      `DELETE FROM group_members WHERE group_id=$1 AND user_id=$2`,
      [groupId, userId]
    );

    if ((del.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Not a member of this group" });
    }

await client.query("COMMIT");

await recomputeGroup(groupId);

// ✅ create notification
await pool.query(
  `
  INSERT INTO notifications (user_id, type, title, body, link)
  VALUES ($1, 'GROUP_JOIN', 'Joined group ✅', $2, $3)
  `,
  [userId, `You joined group ${groupId}`, `/groups/${groupId}`]
);


return res.json({ ok: true });
  } catch (e: any) {
    try { await client.query("ROLLBACK"); } catch {}
    return res.status(500).json({ error: e?.message ?? "Leave failed" });
  } finally {
    client.release();
  }
});
export default router;
