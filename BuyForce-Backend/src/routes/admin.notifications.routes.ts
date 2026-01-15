import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  try {
    const q = await pool.query(`
      SELECT
        id,
        user_id as "user_id",
        type,
        title,
        body,
        link,
        is_read as "is_read",
        "createdAt" as "createdAt"
      FROM notifications
      ORDER BY "createdAt" DESC NULLS LAST
      LIMIT 500
    `);

    res.json({ items: q.rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load notifications" });
  }
});

export default router;
