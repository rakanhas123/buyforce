import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

router.get("/", async (_req, res) => {
  const q = await pool.query(`SELECT id, name, slug FROM categories ORDER BY name ASC`);
  res.json(q.rows);
});

// products in category by slug
router.get("/:slug/products", async (req, res) => {
  const slug = String(req.params.slug);
  const q = await pool.query(
    `
    SELECT p.*
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    WHERE c.slug=$1 AND COALESCE(p."isActive", true)=true
    ORDER BY p."createdAt" DESC NULLS LAST
    LIMIT 100
    `,
    [slug]
  );
  res.json(q.rows);
});

export default router;
