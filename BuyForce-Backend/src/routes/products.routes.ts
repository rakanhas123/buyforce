import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /v1/products
 * Returns products from DB if table exists, otherwise returns demo data
 */
router.get("/", async (_req, res) => {
  try {
    // try DB table "products"
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT 50');
    return res.json({ source: "db", items: result.rows });
  } catch (err: any) {
    // If DB works but table missing, still return something usable
    const msg = err?.message ?? "";
    if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("does not exist")) {
      return res.json({
        source: "fallback",
        items: [
          { id: 1, name: "Demo Product", price: 10 },
          { id: 2, name: "Another Product", price: 25 },
        ],
        note: "DB connected but 'products' table not found. Create it to use real data.",
      });
    }
    return res.status(500).json({ error: msg });
  }
});

export default router;
