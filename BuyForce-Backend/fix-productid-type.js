const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

async function fixProductIdColumn() {
  try {
    await pool.query('ALTER TABLE groups ALTER COLUMN "productId" TYPE integer USING NULL');
    console.log('✅ Changed productId column to integer type');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixProductIdColumn();
