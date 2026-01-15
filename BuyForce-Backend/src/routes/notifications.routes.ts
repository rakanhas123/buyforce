import { Router } from "express";
import { pool } from "../db/db";
import { authMiddleware } from "../middleware/auth.middleware"; // אצלך יכול להיקרא אחרת

const router = Router();

router.get("/", authMiddleware, async (req: any, res) => {
  const userId = req.user?.id || req.userId || req.auth?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const q = await pool.query(
      `
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
      WHERE user_id = $1
      ORDER BY "createdAt" DESC NULLS LAST
      LIMIT 200
      `,
      [userId]
    );

    res.json({ items: q.rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load notifications" });
  }
});

export default router;
