const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'rakan1',
  database: 'buyforce',
});

async function checkProducts() {
  const client = await pool.connect();
  try {
    // Check table structure
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);
    
    console.log('מבנה טבלת products:');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    // Check existing data
    const count = await client.query('SELECT COUNT(*) FROM products');
    console.log(`\nמספר מוצרים: ${count.rows[0].count}`);
    
    if (count.rows[0].count > 0) {
      const sample = await client.query('SELECT * FROM products LIMIT 3');
      console.log('\nדוגמה למוצרים:');
      sample.rows.forEach(p => {
        console.log(`  ${p.id}: ${p.name} - ₪${p.price}`);
      });
    }
    
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkProducts();
