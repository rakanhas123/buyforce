import express from "express";
import pool from "../db/db";

const router = express.Router();

/* ==========================================
   CREATE GROUP  (Admin creates new group)
   POST /api/groups/create
========================================== */
router.post("/create", async (req, res) => {
  try {
    const { product_id, price } = req.body;

    if (!product_id || !price) {
      return res.status(400).json({ error: "product_id and price are required" });
    }

    const result = await pool.query(
      `INSERT INTO groups (product_id, price)
       VALUES ($1, $2)
       RETURNING *`,
      [product_id, price]
    );

    const newGroup = result.rows[0];

    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["ADMIN_CREATE_GROUP", { product_id, price }]
    );

    res.json({
      message: "Group created successfully",
      group: newGroup
    });

  } catch (err: any) {
    console.error("Error creating group:", err.message);
    res.status(500).json({ error: err.message });
  }
});


/* ==========================================
   GET ALL GROUPS
   GET /api/groups
========================================== */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM groups ORDER BY id DESC`
    );

    res.json({ groups: result.rows });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


/* ==========================================
   GET GROUP BY ID
   GET /api/groups/:id
========================================== */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM groups WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ group: result.rows[0] });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


/* ==========================================
   CLOSE GROUP (Admin closes group manually)
   PATCH /api/groups/close/:id
========================================== */
router.patch("/close/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `UPDATE groups
       SET status = 'closed',
           closed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    const closedGroup = result.rows[0];

    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["ADMIN_CLOSE_GROUP", { group_id: id }]
    );

    res.json({
      message: "Group closed successfully",
      group: closedGroup
    });

  } catch (err: any) {
    console.error("Error closing group:", err.message);
    res.status(500).json({ error: err.message });
  }
});


export default router;
