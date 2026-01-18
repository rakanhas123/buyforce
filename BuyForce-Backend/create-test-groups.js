const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

async function createTestGroups() {
  try {
    // First, get some products from the database
    const productsResult = await pool.query('SELECT id, name FROM products LIMIT 5');
    const products = productsResult.rows;

    if (products.length === 0) {
      console.log('  No products found in database. Please add products first.');
      return;
    }

    console.log(`Found ${products.length} products`);

    // Create test groups
    const groups = [
      {
        name: 'iPhone 15 Pro Group Buy',
        productId: products[0]?.id,
        min_participants: 10,
        joined_count: 7,
        progress: 70,
        status: 'OPEN',
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        name: 'MacBook Air M3 Deal',
        productId: products[1]?.id,
        min_participants: 15,
        joined_count: 12,
        progress: 80,
        status: 'OPEN',
        ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        name: 'AirPods Pro Bundle',
        productId: products[2]?.id,
        min_participants: 20,
        joined_count: 18,
        progress: 90,
        status: 'OPEN',
        ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        name: 'iPad Mini Group',
        productId: products[3]?.id,
        min_participants: 8,
        joined_count: 8,
        progress: 100,
        status: 'LOCKED',
        ends_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        name: 'Apple Watch Series 9',
        productId: products[4]?.id,
        min_participants: 12,
        joined_count: 3,
        progress: 25,
        status: 'OPEN',
        ends_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
    ];

    for (const group of groups) {
      const result = await pool.query(
        `INSERT INTO groups (name, "productId", min_participants, joined_count, progress, status, ends_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name`,
        [
          group.name,
          group.productId,
          group.min_participants,
          group.joined_count,
          group.progress,
          group.status,
          group.ends_at,
        ]
      );
      console.log(` Created group: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }

    console.log('\n Successfully created test groups!');
  } catch (error) {
    console.error(' Error creating test groups:', error.message);
  } finally {
    await pool.end();
  }
}

createTestGroups();
