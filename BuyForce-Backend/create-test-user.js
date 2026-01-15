const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'rakan1',
  database: 'buyforce',
});

async function createTestUser() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Update user with hashed password
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = NOW()
       WHERE email = $2
       RETURNING id, full_name, email, phone`,
      [hashedPassword, 'test@buyforce.com']
    );
    
    console.log('✅ Test user password updated!');
    console.log('📧 Email: test@buyforce.com');
    console.log('🔑 Password: 123456');
    console.log('User data:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error updating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
