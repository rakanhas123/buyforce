import express from 'express';
import pool from '../db';

const router = express.Router();

// פתיחת קבוצה חדשה
router.post('/', async (req, res) => {
  try {
    const { productId, name, maxMembers, price } = req.body;

    const result = await pool.query(
      `INSERT INTO groups (product_id, name, max_members, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, name, maxMembers, price]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["OPEN_GROUP", JSON.stringify({ productId, name })]
    );

    res.json(result.rows[0]);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

// סגירת קבוצה
router.patch('/:id/close', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `UPDATE groups
       SET status='CLOSED'
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["CLOSE_GROUP", JSON.stringify({ groupId: id })]
    );

    res.json(result.rows[0]);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

// שינוי מחיר
router.patch('/:id/price', async (req, res) => {
  try {
    const id = req.params.id;
    const { newPrice } = req.body;

    const result = await pool.query(
      `UPDATE groups
       SET price=$1
       WHERE id=$2
       RETURNING *`,
      [newPrice, id]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, details)
       VALUES ($1, $2)`,
      ["CHANGE_GROUP_PRICE", JSON.stringify({ groupId: id, newPrice })]
    );

    res.json(result.rows[0]);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
