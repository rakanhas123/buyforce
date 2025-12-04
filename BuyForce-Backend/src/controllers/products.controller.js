const db = require("../db/db");

// ---------------------- Get All Products ----------------------
exports.getAllProducts = async (req, res) => {
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

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------------- Get Product by ID ----------------------
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // מוצר
    const product = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    // תמונות
    const images = await db.query(
      "SELECT * FROM images WHERE product_id = $1",
      [id]
    );

    // מאפיינים (specs)
    const specs = await db.query(
      "SELECT * FROM specs WHERE product_id = $1",
      [id]
    );

    // group של מוצרים דומים
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

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------------- Get Categories ----------------------
exports.getCategories = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
