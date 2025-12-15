import { Router, Request, Response } from "express";
import db from "../db/db";

const router = Router();

/**
 * GET /v1/products
 * Filters, sorting, search (NO categories)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, sort, search } = req.query;

    let query = `
      SELECT 
        p.*,
        (SELECT image_url
         FROM images
         WHERE product_id = p.id AND is_main = true
         LIMIT 1) AS main_image
      FROM products p
      WHERE 1=1
    `;

    if (minPrice) query += ` AND p.price >= ${Number(minPrice)}`;
    if (maxPrice) query += ` AND p.price <= ${Number(maxPrice)}`;
    if (search)   query += ` AND p.name ILIKE '%${search}%'`;

    if (sort === "price_asc")  query += ` ORDER BY p.price ASC`;
    if (sort === "price_desc") query += ` ORDER BY p.price DESC`;
    if (sort === "newest")     query += ` ORDER BY p.created_at DESC`;

    const result = await db.query(query);
    res.json(result.rows);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /v1/products/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.*,
        (SELECT image_url
         FROM images
         WHERE product_id = p.id AND is_main = true
         LIMIT 1) AS main_image
      FROM products p
      WHERE p.id = $1
      LIMIT 1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
