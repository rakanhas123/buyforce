import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/categories
 * Get all categories
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, parent_id, image_url FROM categories ORDER BY name ASC`
    );
    
    return res.json(result.rows);
  } catch (e: any) {
    console.error("Error fetching categories:", e);
    return res.status(500).json({ error: e?.message ?? "Failed to fetch categories" });
  }
});

/**
 * GET /api/categories/:id
 * Get a single category by ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, parent_id, image_url FROM categories WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(result.rows[0]);
  } catch (e: any) {
    console.error("Error fetching category:", e);
    return res.status(500).json({ error: e?.message ?? "Failed to fetch category" });
  }
});

export default router;
