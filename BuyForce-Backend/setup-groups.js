const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'rakan1',
  database: 'buyforce',
});

async function setupGroups() {
  const client = await pool.connect();
  try {
    console.log('בודק אם טבלת groups קיימת...');
    
    // Create groups table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        "minParticipants" INTEGER DEFAULT 10,
        "joinedCount" INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0,
        "endsAt" TIMESTAMP,
        "notified70" BOOLEAN DEFAULT false,
        "notified95" BOOLEAN DEFAULT false,
        "notifiedLast12h" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ טבלת groups נוצרה/קיימת');
    
    // Check if groups exist
    const result = await client.query('SELECT COUNT(*) FROM groups');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('מוסיף קבוצות ברירת מחדל...');
      
      await client.query(`
        INSERT INTO groups (name, status, "minParticipants", "joinedCount", progress) VALUES
        ('iPhone 15 Pro - הזדמנות מטורפת', 'active', 50, 42, 84),
        ('MacBook Air M3 - קבוצת רכישה', 'active', 30, 28, 93),
        ('AirPods Pro 2 - מבצע חם', 'active', 100, 67, 67),
        ('Samsung Galaxy S24 Ultra', 'active', 40, 25, 62),
        ('PlayStation 5 - קונסולה', 'active', 60, 45, 75),
        ('DJI Mini 4 Pro - רחפן', 'active', 25, 18, 72),
        ('iPad Pro 12.9 M2', 'active', 35, 30, 85),
        ('Apple Watch Series 9', 'completed', 50, 50, 100),
        ('Nintendo Switch OLED', 'completed', 40, 40, 100),
        ('Sony WH-1000XM5 - אוזניות', 'completed', 80, 80, 100);
      `);
      
      console.log('✅ קבוצות ברירת מחדל נוספו');
    } else {
      console.log(`✅ קיימות ${count} קבוצות במסד הנתונים`);
    }
    
    // Display groups
    const groups = await client.query('SELECT id, name, status, "joinedCount", "minParticipants", progress FROM groups ORDER BY id LIMIT 10');
    console.log('\nקבוצות:');
    groups.rows.forEach(g => {
      console.log(`  ${g.id}: ${g.name} (${g.status}) - ${g.joinedCount}/${g.minParticipants} (${g.progress}%)`);
    });
    
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setupGroups()
  .then(() => {
    console.log('\n✅ הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ נכשל:', err);
    process.exit(1);
  });
