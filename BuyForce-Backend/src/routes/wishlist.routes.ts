import { Router } from "express";
import { pool } from "../db/db";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * GET /v1/wishlist
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;

  try {
    const r = await pool.query(
      `SELECT id, name, url, created_at
       FROM wishlist
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.json({ items: r.rows });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load wishlist" });
  }
});

/**
 * POST /v1/wishlist
 * body: { name, url }
 */
router.post("/", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;
  const { name, url } = req.body as { name?: string; url?: string };

  if (!name || !name.trim()) return res.status(400).json({ error: "name is required" });

  try {
    const r = await pool.query(
      `INSERT INTO wishlist (user_id, name, url)
       VALUES ($1,$2,$3)
       RETURNING id, name, url, created_at`,
      [userId, name.trim(), url?.trim() || null]
    );
    return res.json({ item: r.rows[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to add item" });
  }
});

/**
 * DELETE /v1/wishlist/:id
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;
  const id = req.params.id;

  try {
    const r = await pool.query(`DELETE FROM wishlist WHERE id=$1 AND user_id=$2`, [id, userId]);
    if ((r.rowCount ?? 0) === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to delete" });
  }
});

export default router;
