import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sort, search } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name,
             (SELECT image_url FROM images
              WHERE product_id = p.id AND is_main = true LIMIT 1) AS main_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    if (category) query += ` AND p.category_id = ${category}`;
    if (minPrice) query += ` AND p.price >= ${minPrice}`;
    if (maxPrice) query += ` AND p.price <= ${maxPrice}`;
    if (search)   query += ` AND p.name ILIKE '%${search}%'`;
    if (sort === "price_asc")  query += ` ORDER BY p.price ASC`;
    if (sort === "price_desc") query += ` ORDER BY p.price DESC`;
    if (sort === "newest")     query += ` ORDER BY p.created_at DESC`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
