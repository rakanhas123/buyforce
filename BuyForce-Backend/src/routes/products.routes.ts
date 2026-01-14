import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/products
 * Returns products with their main images
 */
router.get("/", async (_req, res) => {
  try {
    // Get products with their main image and category
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock as stock_quantity,
        p.created_at,
        p.category_id,
        c.name as category_name,
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id,
              'image_url', i.image_url,
              'is_main', i.is_main
            )
            ORDER BY i.is_main DESC, i.id ASC
          )
          FROM images i
          WHERE i.product_id = p.id
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
      LIMIT 50
    `);

    // Format the response
    const items = result.rows.map(row => ({
      ...row,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name
      } : null,
      images: row.images || []
    }));

    // Remove redundant fields
    items.forEach(item => {
      delete item.category_name;
    });

    return res.json({
      source: "db",
      items,
    });
  } catch (err: any) {
    const msg = err?.message ?? "";

    if (
      msg.toLowerCase().includes("relation") &&
      msg.toLowerCase().includes("does not exist")
    ) {
      return res.json({
        source: "fallback",
        items: [
          { id: 1, name: "Demo Product", price: 10 },
          { id: 2, name: "Another Product", price: 25 },
        ],
        note: "products table not found – using demo data",
      });
    }

    return res.status(500).json({ error: msg });
  }
});

/**
 * GET /api/products/:id
 * Get single product with full details (images, specs, category)
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Get product with category
    const productResult = await pool.query(
      `SELECT 
         p.id,
         p.name,
         p.description,
         p.price,
         p.stock as stock_quantity,
         p.created_at,
         p.category_id,
         c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];

    // Get images
    const imagesResult = await pool.query(
      `SELECT id, image_url, is_main
       FROM images
       WHERE product_id = $1
       ORDER BY is_main DESC, id ASC`,
      [id]
    );

    // Get specs
    const specsResult = await pool.query(
      `SELECT spec_key, spec_value
       FROM specs
       WHERE product_id = $1`,
      [id]
    );

    // Build response
    const response = {
      ...product,
      category: product.category_name
        ? {
            id: product.category_id,
            name: product.category_name,
          }
        : null,
      images: imagesResult.rows,
      specs: specsResult.rows,
    };

    // Remove redundant fields
    delete response.category_id;
    delete response.category_name;

    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
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
