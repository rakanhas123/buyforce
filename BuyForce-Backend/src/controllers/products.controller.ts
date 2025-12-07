import { Request, Response } from "express";
import db from "../db/db";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { category, minPrice, maxPrice, sort, search } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name,
             (SELECT image_url FROM images
              WHERE product_id = p.id AND is_main = true LIMIT 1) AS main_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1 = 1
    `;
    if (category) query += ` AND p.category_id = ${category}`;
    if (minPrice) query += ` AND p.price >= ${minPrice}`;
    if (maxPrice) query += ` AND p.price <= ${maxPrice}`;
    if (search)   query += ` AND p.name ILIKE '%${search}%'`;
    if (sort === "price_asc")  query += ` ORDER BY p.price ASC`;
    if (sort === "price_desc") query += ` ORDER BY p.price DESC`;
    if (sort === "newest")     query += ` ORDER BY p.created_at DESC`;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    const images = await db.query(
      "SELECT * FROM images WHERE product_id = $1",
      [id]
    );
    const specs = await db.query(
      "SELECT * FROM specs WHERE product_id = $1",
      [id]
    );
    const group = await db.query(
      "SELECT id, name, price FROM products WHERE group_id = $1",
      [product.rows[0].group_id]
    );
    res.json({
      product: product.rows[0],
      images: images.rows,
      specs: specs.rows,
      group: group.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
