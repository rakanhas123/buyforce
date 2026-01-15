import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  try {
    const [u, g, w, n] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS c FROM users`),
      pool.query(`SELECT COUNT(*)::int AS c FROM groups`),
      pool.query(`SELECT COUNT(*)::int AS c FROM wishlist_items`),
      pool.query(`SELECT COUNT(*)::int AS c FROM notifications`),
    ]);

    res.json({
      users: u.rows[0]?.c ?? 0,
      groups: g.rows[0]?.c ?? 0,
      wishlist: w.rows[0]?.c ?? 0,
      notifications: n.rows[0]?.c ?? 0,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load dashboard" });
  }
});

export default router;
