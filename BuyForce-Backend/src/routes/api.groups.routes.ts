import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/groups
 * מחזיר את כל הקבוצות
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM groups ORDER BY "createdAt" DESC NULLS LAST, id DESC LIMIT 50`
    );
    return res.json(result.rows);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/groups/:id
 * מחזיר קבוצה לפי ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM groups WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }
    
    return res.json(result.rows[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
