import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /v1/groups
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, status, created_at FROM groups ORDER BY created_at DESC, id DESC LIMIT 50`
    );
    return res.json({ items: result.rows });
  } catch (e: any) {
    console.error("Error fetching groups:", e);
    return res.status(500).json({ error: e?.message ?? "Failed to load groups" });
  }
});

/**
 * GET /v1/groups/:id
 */
router.get("/:id", async (req, res) => {
  const groupId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT id, name, status, created_at FROM groups WHERE id = $1`,
      [groupId]
    );

    if ((result.rowCount ?? 0) === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.json(result.rows[0]);
  } catch (e: any) {
    console.error("Error fetching group:", e);
    return res.status(500).json({ error: e?.message ?? "Failed to fetch group" });
  }
});

export default router;

