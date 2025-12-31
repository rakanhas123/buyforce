import express from "express";
import pool from "../db";

const router = express.Router();

/* ================================
   CREATE PRODUCT (Admin)
   POST /api/products/admin/create
================================ */
router.post("/admin/create", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "name and price are required" });
    }

    // Create product in DB
    const result = await pool.query(
      `INSERT INTO products (name, price, stock)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, price, stock ?? 0]
    );

    const newProduct = result.rows[0];

    // Add audit log
    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["ADMIN_CREATE_PRODUCT", { name, price, stock }]
    );

    res.json({
      message: "Product created successfully",
      product: newProduct,
    });

  } catch (err: any) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ error: err.message });
  }
});


/* ================================
   UPDATE PRODUCT PRICE (Admin)
   PATCH /api/products/admin/price/:id
================================ */
router.patch("/admin/price/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ error: "price is required" });
    }

    // Update product price in DB
    const result = await pool.query(
      `UPDATE products SET price = $1 WHERE id = $2 RETURNING *`,
      [price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = result.rows[0];

    // Add audit log
    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["ADMIN_UPDATE_PRICE", { id, new_price: price }]
    );

    res.json({
      message: "Price updated successfully",
      product: updatedProduct,
    });

  } catch (err: any) {
    console.error("Error updating product price:", err.message);
    res.status(500).json({ error: err.message });
  }
});


export default router;
