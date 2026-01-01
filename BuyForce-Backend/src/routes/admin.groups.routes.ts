import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

const STATUS = ["OPEN", "LOCKED", "CHARGED", "FAILED"] as const;
type Status = (typeof STATUS)[number];

// GET /v1/admin/groups
router.get("/", adminOnly, async (_req, res) => {
  const r = await pool.query(`SELECT * FROM groups ORDER BY "createdAt" DESC NULLS LAST, id DESC`);
  return res.json({ items: r.rows });
});

// POST /v1/admin/groups  (create)
router.post("/", adminOnly, async (req, res) => {
  const { name, description, minParticipants } = req.body as {
    name?: string;
    description?: string;
    minParticipants?: number;
  };

  if (!name) return res.status(400).json({ error: "name is required" });

  const min = Number(minParticipants ?? 1);
  if (!Number.isFinite(min) || min < 1) return res.status(400).json({ error: "minParticipants must be >= 1" });

  const r = await pool.query(
    `
    INSERT INTO groups (name, description, "minParticipants", "joinedCount", progress, status)
    VALUES ($1,$2,$3,0,0,'OPEN')
    RETURNING *
    `,
    [name, description ?? null, min]
  );

  return res.json({ item: r.rows[0] });
});

// PATCH /v1/admin/groups/:id  (edit)
router.patch("/:id", adminOnly, async (req, res) => {
  const { name, description, minParticipants } = req.body as {
    name?: string;
    description?: string;
    minParticipants?: number;
  };

  const id = req.params.id;

  const r = await pool.query(
    `
    UPDATE groups
    SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      "minParticipants" = COALESCE($4, "minParticipants")
    WHERE id = $1
    RETURNING *
    `,
    [id, name ?? null, description ?? null, minParticipants ?? null]
  );

  if ((r.rowCount ?? 0) === 0) return res.status(404).json({ error: "Group not found" });
  return res.json({ item: r.rows[0] });
});

// POST /v1/admin/groups/:id/status  (force status)
router.post("/:id/status", adminOnly, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body as { status?: Status };

  if (!status || !STATUS.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUS.join(", ")}` });
  }

  const r = await pool.query(`UPDATE groups SET status=$2 WHERE id=$1 RETURNING id, status`, [id, status]);
  if ((r.rowCount ?? 0) === 0) return res.status(404).json({ error: "Group not found" });

  return res.json({ item: r.rows[0] });
});

// DELETE /v1/admin/groups/:id
router.delete("/:id", adminOnly, async (req, res) => {
  const id = req.params.id;

  // delete members first to avoid FK issues (if you have foreign keys)
  await pool.query(`DELETE FROM group_members WHERE group_id=$1`, [id]);
  const r = await pool.query(`DELETE FROM groups WHERE id=$1`, [id]);

  if ((r.rowCount ?? 0) === 0) return res.status(404).json({ error: "Group not found" });
  return res.json({ ok: true });
});

export default router;
