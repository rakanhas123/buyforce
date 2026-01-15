import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

router.get("/", adminOnly, async (_req, res) => {
  try {
    const q = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p."priceRegular" as "priceRegular",
        p."priceGroup" as "priceGroup",
        p."isActive" as "isActive",
        p."categoryId" as "categoryId",
        c.name as "categoryName",
        c.slug as "categorySlug",
        p."createdAt" as "createdAt"
      FROM products p
      LEFT JOIN categories c ON c.id = p."categoryId"
      ORDER BY p."createdAt" DESC NULLS LAST, p.id DESC
      LIMIT 500
      `
    );
    res.json({ items: q.rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load products" });
  }
});

router.post("/", adminOnly, async (req, res) => {
  const client = await pool.connect();
  try {
    const name = String(req.body?.name ?? "").trim();
    const description = req.body?.description == null ? null : String(req.body.description);
    const priceRegular = req.body?.priceRegular;
    const priceGroup = req.body?.priceGroup;
    const isActive = req.body?.isActive == null ? true : Boolean(req.body.isActive);
    const categoryId = req.body?.categoryId ? String(req.body.categoryId) : null;

    const minParticipants = Number(req.body?.minParticipants ?? 10);
    const endsAt = req.body?.endsAt ? String(req.body.endsAt) : daysFromNow(3);

    if (!name) return res.status(400).json({ error: "name is required" });
    if (priceRegular == null || priceGroup == null) return res.status(400).json({ error: "prices required" });

    await client.query("BEGIN");

    // Create product
    const p = await client.query(
      `
      INSERT INTO products (name, description, "priceRegular", "priceGroup", "isActive", "categoryId")
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, name, description, "priceRegular" as "priceRegular", "priceGroup" as "priceGroup",
                "isActive" as "isActive", "categoryId" as "categoryId", "createdAt" as "createdAt"
      `,
      [name, description, priceRegular, priceGroup, isActive, categoryId]
    );

    const product = p.rows[0];

    // Create group for product
    await client.query(
      `
      INSERT INTO groups
      (name, "productId", "minParticipants", "joinedCount", progress, status, "endsAt",
       "notified70", "notified95", "notifiedLast12h")
      VALUES
      ($1, $2, $3, 0, 0, 'OPEN', $4, false, false, false)
      `,
      [`${name} Group`, product.id, minParticipants, endsAt]
    );

    await client.query("COMMIT");
    res.json({ item: product });
  } catch (e: any) {
    try { await client.query("ROLLBACK"); } catch {}
    res.status(500).json({ error: e?.message ?? "Create product failed" });
  } finally {
    client.release();
  }
});

router.post("/:id/toggle", adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);
    await pool.query(`UPDATE products SET "isActive" = NOT COALESCE("isActive", true) WHERE id=$1`, [id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Toggle failed" });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  const client = await pool.connect();
  try {
    const id = String(req.params.id);
    await client.query("BEGIN");

    // delete group members of groups for this product
    const groups = await client.query(`SELECT id FROM groups WHERE "productId"=$1`, [id]);
    for (const g of groups.rows) {
      await client.query(`DELETE FROM group_members WHERE group_id=$1`, [g.id]);
    }

    // delete groups for product
    await client.query(`DELETE FROM groups WHERE "productId"=$1`, [id]);

    // delete wishlist references (if you store productId there)
    await client.query(`DELETE FROM wishlist_items WHERE product_id=$1 OR "productId"=$1`, [id]).catch(() => {});

    // delete product
    await client.query(`DELETE FROM products WHERE id=$1`, [id]);

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (e: any) {
    try { await client.query("ROLLBACK"); } catch {}
    res.status(500).json({ error: e?.message ?? "Delete failed" });
  } finally {
    client.release();
  }
});
// UPDATE (edit product)
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);

    const name = req.body?.name == null ? null : String(req.body.name).trim();
    const description =
      req.body?.description === undefined ? undefined : (req.body.description == null ? null : String(req.body.description));
    const priceRegular = req.body?.priceRegular === undefined ? undefined : req.body.priceRegular;
    const priceGroup = req.body?.priceGroup === undefined ? undefined : req.body.priceGroup;
    const isActive = req.body?.isActive === undefined ? undefined : Boolean(req.body.isActive);
    const categoryId =
      req.body?.categoryId === undefined ? undefined : (req.body.categoryId ? String(req.body.categoryId) : null);

    // build dynamic update so you can edit only what you send
    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;

    if (name !== null) { sets.push(`name=$${i++}`); vals.push(name); }
    if (description !== undefined) { sets.push(`description=$${i++}`); vals.push(description); }
    if (priceRegular !== undefined) { sets.push(`"priceRegular"=$${i++}`); vals.push(priceRegular); }
    if (priceGroup !== undefined) { sets.push(`"priceGroup"=$${i++}`); vals.push(priceGroup); }
    if (isActive !== undefined) { sets.push(`"isActive"=$${i++}`); vals.push(isActive); }
    if (categoryId !== undefined) { sets.push(`"categoryId"=$${i++}`); vals.push(categoryId); }

    if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });

    vals.push(id);
    const q = await pool.query(
      `
      UPDATE products
      SET ${sets.join(", ")}
      WHERE id=$${i}
      RETURNING id, name, description, "priceRegular" as "priceRegular", "priceGroup" as "priceGroup",
                "isActive" as "isActive", "categoryId" as "categoryId", "createdAt" as "createdAt"
      `,
      vals
    );

    if ((q.rowCount ?? 0) === 0) return res.status(404).json({ error: "Product not found" });

    res.json({ item: q.rows[0] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Update failed" });
  }
});

export default router;
