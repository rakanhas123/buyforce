import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * GET /v1/products  -> מחזיר Product[] (מערך!)
 */
router.get("/", async (_req, res) => {
  try {
    const r = await pool.query(
      `
      SELECT p.*,
             c.id   AS "categoryId",
             c.name AS "categoryName",
             c.slug AS "categorySlug"
      FROM products p
      LEFT JOIN categories c ON c.id = p."categoryId"
      WHERE p."isActive" = true
      ORDER BY p."createdAt" DESC
      `
    );

    // מחזירים בדיוק מה שה-frontend מצפה
    const items = r.rows.map((x: any) => ({
      id: x.id,
      name: x.name,
      description: x.description,
      priceRegular: String(x.priceRegular),
      priceGroup: String(x.priceGroup),
      imageUrl: x.imageUrl ?? null,
      category: x.categoryId
        ? { id: x.categoryId, name: x.categoryName, slug: x.categorySlug }
        : null,
    }));

    return res.json(items);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load products" });
  }
});

/**
 * GET /v1/products/:id -> Product
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const r = await pool.query(
      `
      SELECT p.*,
             c.id   AS "categoryId",
             c.name AS "categoryName",
             c.slug AS "categorySlug"
      FROM products p
      LEFT JOIN categories c ON c.id = p."categoryId"
      WHERE p.id = $1
      `,
      [id]
    );

    if (r.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    const x: any = r.rows[0];
    return res.json({
      id: x.id,
      name: x.name,
      description: x.description,
      priceRegular: String(x.priceRegular),
      priceGroup: String(x.priceGroup),
      imageUrl: x.imageUrl ?? null,
      category: x.categoryId
        ? { id: x.categoryId, name: x.categoryName, slug: x.categorySlug }
        : null,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load product" });
  }
});

/**
 * GET /v1/products/:id/group -> Group
 * מחזיר את הקבוצה האמיתית מה-DB (UUID), כדי ש-join יעבוד
 */
router.get("/:id/group", async (req, res) => {
  try {
    const productId = req.params.id;

    const r = await pool.query(
      `
      SELECT *
      FROM groups
      WHERE "productId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 1
      `,
      [productId]
    );

    if (r.rows.length === 0) return res.status(404).json({ error: "Group for product not found" });

    return res.json(r.rows[0]);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load product group" });
  }
});

export default router;
