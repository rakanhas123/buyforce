import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/categories
 * מחזיר את כל הקטגוריות
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    return res.json(result.rows);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/categories/:id/products
 * מחזיר מוצרים לפי קטגוריה
 */
router.get("/:id/products", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT json_agg(json_build_object('id', i.id, 'image_url', i.image_url, 'is_main', i.is_main))
         FROM images i WHERE i.product_id = p.id) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.id DESC 
    `, [categoryId]);

    // Transform to match expected format
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stock: row.stock,
      stock_quantity: row.stock,
      created_at: row.created_at,
      category: {
        id: row.category_id,
        name: row.category_name
      },
      images: row.images || []
    }));

    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
