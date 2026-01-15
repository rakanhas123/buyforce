import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  const q = await pool.query(`SELECT * FROM groups ORDER BY "createdAt" DESC NULLS LAST LIMIT 200`);
  res.json({ items: q.rows });
});

router.post("/:id/lock", adminOnly, async (req, res) => {
  await pool.query(`UPDATE groups SET status='LOCKED' WHERE id=$1`, [req.params.id]);
  res.json({ ok: true });
});

router.post("/:id/unlock", adminOnly, async (req, res) => {
  await pool.query(`UPDATE groups SET status='OPEN' WHERE id=$1`, [req.params.id]);
  res.json({ ok: true });
});

router.delete("/:id", adminOnly, async (req, res) => {
  const id = req.params.id;
  await pool.query(`DELETE FROM group_members WHERE group_id=$1`, [id]);
  await pool.query(`DELETE FROM groups WHERE id=$1`, [id]);
  res.json({ ok: true });
});

export default router;
