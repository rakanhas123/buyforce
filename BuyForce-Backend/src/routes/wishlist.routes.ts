import { Router } from "express";
import { pool } from "../db/db";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * GET /v1/wishlist -> WishlistItem[]
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;

  try {
    const r = await pool.query(
      `
      SELECT wi.id,
             wi."productId",
             wi."createdAt",
             p.name AS "productName"
      FROM wishlist_items wi
      LEFT JOIN products p ON p.id = wi."productId"
      WHERE wi.user_id = $1
      ORDER BY wi."createdAt" DESC
      `,
      [userId]
    );

    return res.json(
      r.rows.map((x: any) => ({
        id: x.id,
        productId: x.productId,
        productName: x.productName ?? null,
        createdAt: x.createdAt,
      }))
    );
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load wishlist" });
  }
});

/**
 * GET /v1/wishlist/has/:productId -> {has:boolean}
 */
router.get("/has/:productId", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;
  const productId = req.params.productId;

  try {
    const r = await pool.query(
      `SELECT 1 FROM wishlist_items WHERE user_id=$1 AND "productId"=$2 LIMIT 1`,
      [userId, productId]
    );
    return res.json({ has: r.rows.length > 0 });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to check wishlist" });
  }
});

/**
 * POST /v1/wishlist/:productId
 */
router.post("/:productId", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;
  const productId = req.params.productId;

  try {
    await pool.query(
      `
      INSERT INTO wishlist_items (user_id, "productId")
      VALUES ($1,$2)
      ON CONFLICT (user_id, "productId") DO NOTHING
      `,
      [userId, productId]
    );

    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message ?? "Add wishlist failed" });
  }
});

/**
 * DELETE /v1/wishlist/:productId
 */
router.delete("/:productId", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).user!.id;
  const productId = req.params.productId;

  try {
    await pool.query(
      `DELETE FROM wishlist_items WHERE user_id=$1 AND "productId"=$2`,
      [userId, productId]
    );
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message ?? "Delete wishlist failed" });
  }
});

export default router;
