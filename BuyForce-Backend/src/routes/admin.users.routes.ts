import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  try {
    const q = await pool.query(
      `SELECT id, email, "fullName", "createdAt"
       FROM users
       ORDER BY "createdAt" DESC NULLS LAST`
    );
    res.json({ items: q.rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load users" });
  }
});

// delete user (וגם לנקות דברים קשורים)
router.delete("/:id", adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`DELETE FROM notifications WHERE user_id=$1`, [id]);
    await pool.query(`DELETE FROM wishlist_items WHERE user_id=$1`, [id]);
    await pool.query(`DELETE FROM group_members WHERE user_id=$1`, [id]);
    await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Delete failed" });
  }
});

export default router;
