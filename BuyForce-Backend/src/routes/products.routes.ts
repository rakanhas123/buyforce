import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/products
 * מחזיר מוצרים מה־DB עם תמונות וקטגוריות
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT json_agg(json_build_object('id', i.id, 'image_url', i.image_url, 'is_main', i.is_main))
         FROM images i WHERE i.product_id = p.id) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC 
      LIMIT 50
    `);

    // Transform to match expected format
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stock: row.stock,
      stock_quantity: row.stock,
      created_at: row.created_at,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name
      } : null,
      images: row.images || []
    }));

    return res.json(products);
  } catch (err: any) {
    const msg = err?.message ?? "";

    if (
      msg.toLowerCase().includes("relation") &&
      msg.toLowerCase().includes("does not exist")
    ) {
      return res.json([
        { id: 1, name: "Demo Product", price: 10, images: [] },
        { id: 2, name: "Another Product", price: 25, images: [] },
      ]);
    }

    return res.status(500).json({ error: msg });
  }
});

/**
 * POST /api/products
 * הוספת מוצר חדש
 */
router.post("/", async (req, res) => {
  const { name, price, imageUrl } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "name and price are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, price, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, price, imageUrl]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
