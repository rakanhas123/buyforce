const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'rakan1',
  database: 'buyforce',
});

async function setupCategories() {
  const client = await pool.connect();
  try {
    console.log('בודק אם טבלת categories קיימת...');
    
    // Create categories table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ טבלת categories נוצרה/קיימת');
    
    // Check if categories exist
    const result = await client.query('SELECT COUNT(*) FROM categories');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('מוסיף קטגוריות ברירת מחדל...');
      
      await client.query(`
        INSERT INTO categories (name, description) VALUES
        ('סמארטפונים', 'טלפונים חכמים מכל הסוגים'),
        ('מחשבים ניידים', 'מחשבים נישאים למשרד ובית'),
        ('אביזרי אודיו', 'אוזניות, רמקולים ועוד'),
        ('קונסולות משחק', 'PlayStation, Xbox, Nintendo'),
        ('מצלמות', 'מצלמות DSLR, רחפנים ומצלמות אקסטרים'),
        ('אביזרי מחשב', 'עכברים, מקלדות, מסכים'),
        ('מוצרי חשמל', 'מוצרים חשמליים לבית'),
        ('אביזרי Apple', 'אביזרים למוצרי Apple'),
        ('טכנולוגיה לבית חכם', 'מוצרים לאוטומציה ביתית'),
        ('ספורט וכושר', 'מכשירים לספורט ואימונים');
      `);
      
      console.log('✅ קטגוריות ברירת מחדל נוספו');
    } else {
      console.log(`✅ קיימות ${count} קטגוריות במסד הנתונים`);
    }
    
    // Display categories
    const categories = await client.query('SELECT * FROM categories ORDER BY id');
    console.log('\nקטגוריות:');
    categories.rows.forEach(cat => {
      console.log(`  ${cat.id}: ${cat.name}`);
    });
    
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setupCategories()
  .then(() => {
    console.log('\n✅ הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ נכשל:', err);
    process.exit(1);
  });
