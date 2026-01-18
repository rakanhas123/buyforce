const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

async function migrateGroupsTable() {
  try {
    console.log('🔧 Adding missing columns to groups table...');
    
    await pool.query(`
      ALTER TABLE groups 
      ADD COLUMN IF NOT EXISTS "productId" uuid,
      ADD COLUMN IF NOT EXISTS min_participants integer DEFAULT 10,
      ADD COLUMN IF NOT EXISTS joined_count integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS progress float DEFAULT 0,
      ADD COLUMN IF NOT EXISTS ends_at timestamptz DEFAULT NOW() + interval '7 days',
      ADD COLUMN IF NOT EXISTS notified_70 boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS notified_95 boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS notified_last_12h boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT NOW()
    `);
    
    console.log('✅ Successfully added columns to groups table');
    
    // Update existing rows to have valid end dates if they don't
    await pool.query(`
      UPDATE groups 
      SET ends_at = NOW() + interval '7 days'
      WHERE ends_at IS NULL
    `);
    
    console.log('✅ Updated existing groups with end dates');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

migrateGroupsTable();
