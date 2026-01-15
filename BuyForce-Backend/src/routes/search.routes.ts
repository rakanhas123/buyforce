import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

// GET /v1/search?q=...
router.get("/", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json({ products: [], categories: [] });

  const products = await pool.query(
    `
    SELECT id, name, description, "priceRegular" as "priceRegular", "priceGroup" as "priceGroup"
    FROM products
    WHERE COALESCE("isActive", true)=true
      AND (name ILIKE $1 OR description ILIKE $1)
    ORDER BY "createdAt" DESC NULLS LAST
    LIMIT 20
    `,
    [`%${q}%`]
  );

  const categories = await pool.query(
    `
    SELECT id, name, slug
    FROM categories
    WHERE name ILIKE $1 OR slug ILIKE $1
    ORDER BY name ASC
    LIMIT 20
    `,
    [`%${q}%`]
  );

  res.json({ products: products.rows, categories: categories.rows });
});

export default router;
