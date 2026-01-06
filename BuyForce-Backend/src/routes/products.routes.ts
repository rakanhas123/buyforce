import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /api/products
 * מחזיר מוצרים מה־DB, ואם אין טבלה – demo data
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC LIMIT 50"
    );

    return res.json({
      source: "db",
      items: result.rows,
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
