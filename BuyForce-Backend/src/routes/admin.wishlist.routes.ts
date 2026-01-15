import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  try {
    const q = await pool.query(
      `SELECT wi.*, u.email
       FROM wishlist_items wi
       LEFT JOIN users u ON u.id = wi.user_id
       ORDER BY wi."createdAt" DESC NULLS LAST`
    );
    res.json({ items: q.rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load wishlist" });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    await pool.query(`DELETE FROM wishlist_items WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Delete failed" });
  }
});

export default router;
