import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  const q = await pool.query(`SELECT id, name, slug FROM categories ORDER BY name ASC`);
  res.json({ items: q.rows });
});

router.post("/", adminOnly, async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const slug = String(req.body?.slug ?? "").trim().toLowerCase();
  if (!name || !slug) return res.status(400).json({ error: "name and slug required" });

  const q = await pool.query(
    `INSERT INTO categories (name, slug) VALUES ($1,$2) RETURNING id, name, slug`,
    [name, slug]
  );
  res.json({ item: q.rows[0] });
});

router.delete("/:id", adminOnly, async (req, res) => {
  const id = String(req.params.id);
  await pool.query(`DELETE FROM categories WHERE id=$1`, [id]);
  res.json({ ok: true });
});

export default router;
