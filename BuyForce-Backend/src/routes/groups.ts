import express from "express";
import pool from "../db";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";
import stripe from "../lib/stripe";

const router = express.Router();

/* ==========================================
   CREATE GROUP (Admin)
   POST /api/groups/create
========================================== */
router.post("/create", async (req, res) => {
  try {
    const { product_id, price } = req.body;

    if (!product_id || !price) {
      return res
        .status(400)
        .json({ error: "product_id and price are required" });
    }

    const result = await pool.query(
      `INSERT INTO groups (product_id, price)
       VALUES ($1, $2)
       RETURNING *`,
      [product_id, price]
    );

    res.json({
      message: "Group created successfully",
      group: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   GET ALL GROUPS
========================================== */
router.get("/", async (_req, res) => {
  const result = await pool.query(
    `SELECT * FROM groups ORDER BY id DESC`
  );
  res.json({ groups: result.rows });
});

/* ==========================================
   GET GROUP BY ID
========================================== */
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM groups WHERE id = $1`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Group not found" });
  }

  res.json({ group: result.rows[0] });
});

/* ==========================================
   CLOSE GROUP (Admin)
========================================== */
router.patch("/close/:id", async (req, res) => {
  const result = await pool.query(
    `UPDATE groups
     SET status = 'closed',
         closed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Group not found" });
  }

  res.json({
    message: "Group closed successfully",
    group: result.rows[0],
  });
});

/* ==========================================
   JOIN GROUP (JWT + Stripe Authorization)
   POST /api/groups/:id/join
========================================== */
router.post("/:id/join", authMiddleware, async (req, res) => {
  const groupId = req.params.id;
  const userId = (req as AuthRequest).user!.id;
    try {
      // בדיקה אם כבר הצטרף
      const exists = await pool.query(
        `SELECT 1 FROM group_members
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
      );

      if (exists.rowCount > 0) {
        return res
          .status(400)
          .json({ error: "User already joined this group" });
      }

      // הבאת מחיר המוצר
      const groupResult = await pool.query(
        `SELECT price FROM groups WHERE id = $1`,
        [groupId]
      );

      if (groupResult.rows.length === 0) {
        return res.status(404).json({ error: "Group not found" });
      }

      const amount = groupResult.rows[0].price * 100;

      //  Stripe Authorization (manual capture)
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "ils",
        capture_method: "manual",
        payment_method_types: ["card"],
        metadata: {
          group_id: groupId,
          user_id: userId,
        },
      });

      // שמירה ב־DB
      await pool.query(
        `INSERT INTO group_members (group_id, user_id, payment_intent_id)
         VALUES ($1, $2, $3)`,
        [groupId, userId, paymentIntent.id]
      );

      res.json({
        message: "Joined group",
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ==========================================
   PAY FOR PRODUCT (JWT + Stripe Capture)
   POST /api/groups/:id/pay-product
========================================== */
router.post("/:id/pay-product", authMiddleware, async (req, res) => {
  const groupId = req.params.id;
  const userId = (req as AuthRequest).user!.id;


    try {
      // בדיקה שהקבוצה סגורה
      const groupResult = await pool.query(
        `SELECT * FROM groups WHERE id = $1`,
        [groupId]
      );

      if (groupResult.rows.length === 0) {
        return res.status(404).json({ error: "Group not found" });
      }

      if (groupResult.rows[0].status !== "closed") {
        return res
          .status(400)
          .json({ error: "Group is not closed yet" });
      }

      // בדיקת חבר בקבוצה
      const memberResult = await pool.query(
        `SELECT * FROM group_members
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
      );

      if (memberResult.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "User is not a group member" });
      }

      const member = memberResult.rows[0];

      if (member.product_paid) {
        return res
          .status(400)
          .json({ error: "Product already paid" });
      }

      //  Capture הכסף
      await stripe.paymentIntents.capture(
        member.payment_intent_id
      );

      // יצירת הזמנה
      await pool.query(
        `INSERT INTO orders (user_id, product_id, group_id, amount, status)
         VALUES ($1, $2, $3, $4, 'paid')`,
        [
          userId,
          groupResult.rows[0].product_id,
          groupId,
          groupResult.rows[0].price,
        ]
      );

      // סימון ששולם
      await pool.query(
        `UPDATE group_members
         SET product_paid = true
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
      );

      res.json({ message: "Product paid successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
