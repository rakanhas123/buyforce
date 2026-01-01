import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

// GET /v1/admin/wishlist
router.get("/", adminOnly, async (_req, res) => {
  const r = await pool.query(
    `
    SELECT w.id, w.name, w.url, w.created_at, w.user_id, u.email, u."fullName"
    FROM wishlist w
    JOIN users u ON u.id = w.user_id
    ORDER BY w.created_at DESC
    `
  );

  return res.json({ items: r.rows });
});

export default router;
