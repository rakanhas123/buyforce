const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

async function addCategories() {
  try {
    console.log('🏷️  Adding categories...\n');
    
    // Add more categories
    const categories = [
      { id: 3, name: 'Tablets' },
      { id: 4, name: 'Wearables' },
      { id: 6, name: 'Gaming' },
      { id: 7, name: 'Cameras' },
      { id: 8, name: 'Home' },
    ];
    
    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = $2`,
        [cat.id, cat.name]
      );
      console.log(`✅ Added: ${cat.name}`);
    }
    
    console.log('\n📊 Updating product categories...\n');
    
    // Update products to have correct categories
    const updates = [
      // Phones (1)
      { ids: [2, 3, 4, 7, 8, 20, 21], category: 1 },
      // Laptops (2)
      { ids: [1, 5, 9, 10, 11, 42, 43], category: 2 },
      // Tablets (3)
      { ids: [12, 13, 62, 63], category: 3 },
      // Wearables (4)
      { ids: [16, 17, 23, 56], category: 4 },
      // Headphones (5)
      { ids: [6, 14, 15, 22, 24, 25, 26], category: 5 },
      // Gaming (6)
      { ids: [27, 28, 29, 30, 31, 32, 33], category: 6 },
      // Cameras (7)
      { ids: [34, 35, 36, 37, 38, 39, 40, 41], category: 7 },
      // Home (8)
      { ids: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 58, 59, 60, 61, 64, 65, 66, 67], category: 8 },
    ];
    
    for (const { ids, category } of updates) {
      for (const id of ids) {
        await pool.query(
          `UPDATE products SET category_id = $1 WHERE id = $2`,
          [category, id]
        );
      }
      console.log(`✅ Updated ${ids.length} products for category ${category}`);
    }
    
    console.log('\n✅ All categories and products updated!');
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addCategories();
