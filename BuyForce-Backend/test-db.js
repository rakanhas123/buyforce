const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

async function test() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Basic query
    const result1 = await pool.query('SELECT NOW(), current_database() as db');
    console.log('✅ Test 1 passed - Database:', result1.rows[0].db);
    
    // Test 2: Check if users table exists
    const result2 = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    console.log('✅ Test 2 passed - Users table exists:', result2.rows.length > 0);
    
    // Test 3: Count users
    const result3 = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Test 3 passed - User count:', result3.rows[0].count);
    
    // Test 4: Query specific user
    const result4 = await pool.query('SELECT * FROM users WHERE email = $1', ['test@test.com']);
    console.log('✅ Test 4 passed - Found test user:', result4.rows.length > 0);
    if (result4.rows.length > 0) {
      console.log('  User data:', { id: result4.rows[0].id, email: result4.rows[0].email, full_name: result4.rows[0].full_name });
    }
    
    await pool.end();
    console.log('\n✅ All tests passed!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

test();
