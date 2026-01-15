import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

function mapRows(rows: any[]) {
  return rows.map((x: any) => ({
    id: x.id,
    name: x.name,
    description: x.description,
    priceRegular: String(x.priceRegular),
    priceGroup: String(x.priceGroup),

    // NEW (live from groups)
    group: x.groupId
      ? {
          id: x.groupId,
          productId: x.id,
          joinedCount: Number(x.joinedCount ?? 0),
          minParticipants: Number(x.minParticipants ?? 0),
          progress: Number(x.progress ?? 0),
          status: x.status,
          endsAt: x.endsAt,
        }
      : null,
  }));
}

router.get("/sections", async (_req, res) => {
  try {
    const nearGoal = await pool.query(`
      SELECT
        p.id, p.name, p.description, p."priceRegular", p."priceGroup",
        g.id AS "groupId", g."joinedCount", g."minParticipants", g.progress, g.status, g."endsAt"
      FROM products p
      LEFT JOIN groups g ON g."productId" = p.id
      WHERE p."isActive" = true
      ORDER BY g.progress DESC NULLS LAST, p."createdAt" DESC
      LIMIT 6
    `);

    const topDiscounts = await pool.query(`
      SELECT
        p.id, p.name, p.description, p."priceRegular", p."priceGroup",
        g.id AS "groupId", g."joinedCount", g."minParticipants", g.progress, g.status, g."endsAt"
      FROM products p
      LEFT JOIN groups g ON g."productId" = p.id
      WHERE p."isActive" = true
      ORDER BY ((p."priceRegular" - p."priceGroup") / NULLIF(p."priceRegular",0)) DESC NULLS LAST,
               g.progress DESC NULLS LAST
      LIMIT 6
    `);

    const newArrivals = await pool.query(`
      SELECT
        p.id, p.name, p.description, p."priceRegular", p."priceGroup",
        g.id AS "groupId", g."joinedCount", g."minParticipants", g.progress, g.status, g."endsAt"
      FROM products p
      LEFT JOIN groups g ON g."productId" = p.id
      WHERE p."isActive" = true
      ORDER BY p."createdAt" DESC
      LIMIT 6
    `);

    return res.json([
      { key: "near-goal", title: "Near Goal", items: mapRows(nearGoal.rows) },
      { key: "top-discounts", title: "Top Discounts", items: mapRows(topDiscounts.rows) },
      { key: "new-arrivals", title: "New Arrivals", items: mapRows(newArrivals.rows) },
    ]);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Failed to load home sections" });
  }
});

export default router;
