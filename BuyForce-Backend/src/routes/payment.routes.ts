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

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { groupId } = req.body as { groupId?: string };
    if (!groupId) return res.status(400).json({ error: "groupId is required" });

    const gRes = await pool.query(`SELECT status FROM groups WHERE id=$1`, [groupId]);
    if ((gRes.rowCount ?? 0) === 0) return res.status(404).json({ error: "Group not found" });

    if (gRes.rows[0].status !== STATUS.LOCKED) {
      return res.status(400).json({ error: "Group must be LOCKED to pay" });
    }

    const mem = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2`,
      [groupId, userId]
    );
    if ((mem.rowCount ?? 0) === 0) return res.status(403).json({ error: "Not a member" });

    const url = `http://localhost:5173/payment/success?groupId=${encodeURIComponent(groupId)}`;
    return res.json({ url });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Checkout failed" });
  }
});

router.post("/mark-paid", authMiddleware, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { groupId } = req.body as { groupId?: string };
    if (!groupId) return res.status(400).json({ error: "groupId is required" });

    const mem = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2`,
      [groupId, userId]
    );
    if ((mem.rowCount ?? 0) === 0) return res.status(403).json({ error: "Not a member" });

    const gRes = await pool.query(`SELECT status FROM groups WHERE id=$1`, [groupId]);
    if ((gRes.rowCount ?? 0) === 0) return res.status(404).json({ error: "Group not found" });

    if (gRes.rows[0].status !== STATUS.LOCKED) {
      return res.status(400).json({ error: "Group must be LOCKED to mark paid" });
    }

    await pool.query(`UPDATE groups SET status=$2 WHERE id=$1`, [groupId, STATUS.CHARGED]);
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Mark paid failed" });
  }
});

export default router;
