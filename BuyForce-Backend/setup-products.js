const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'rakan1',
  database: 'buyforce',
});

async function setupProducts() {
  const client = await pool.connect();
  try {
    console.log('בודק אם טבלת products קיימת...');
    
    // Alter table to add missing columns if needed
    try {
      await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`);
      await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER`);
      await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`);
    } catch (e) {
      // Columns might already exist
    }
    
    console.log('✅ טבלת products נוצרה/קיימת');
    
    // Create images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        is_main BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ טבלת images נוצרה/קיימת');
    
    // Check if products exist
    const result = await client.query('SELECT COUNT(*) FROM products');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('מוסיף מוצרים לדוגמה...');
      
      // Get category IDs
      const categories = await client.query('SELECT id, name FROM categories');
      const catMap = {};
      categories.rows.forEach(cat => {
        catMap[cat.name] = cat.id;
      });
      
      // Insert products
      const products = [
        // סמארטפונים
        { name: 'iPhone 15 Pro Max 256GB', desc: 'אייפון 15 פרו מקס עם 256GB אחסון', price: 4999, stock: 50, cat: 'סמארטפונים', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' },
        { name: 'iPhone 15 Pro 128GB', desc: 'אייפון 15 פרו עם 128GB אחסון', price: 4499, stock: 30, cat: 'סמארטפונים', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' },
        { name: 'Samsung Galaxy S24 Ultra', desc: 'גלקסי S24 אולטרה עם מסך 6.8 אינץ', price: 4799, stock: 35, cat: 'סמארטפונים', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500' },
        { name: 'Samsung Galaxy S24+', desc: 'גלקסי S24+ עם מסך 6.7 אינץ', price: 3999, stock: 40, cat: 'סמארטפונים', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500' },
        
        // מחשבים ניידים
        { name: 'MacBook Air M3 15"', desc: 'מקבוק אייר 15 אינץ עם שבב M3', price: 7999, stock: 20, cat: 'מחשבים ניידים', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
        { name: 'MacBook Air M3 13"', desc: 'מקבוק אייר 13 אינץ עם שבב M3', price: 5999, stock: 25, cat: 'מחשבים ניידים', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
        { name: 'MacBook Pro 16" M3 Max', desc: 'מקבוק פרו 16 אינץ עם שבב M3 Max', price: 14999, stock: 10, cat: 'מחשבים ניידים', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
        { name: 'Dell XPS 15 9530', desc: 'מחשב נייד Dell XPS 15 עם Intel i7', price: 8999, stock: 15, cat: 'מחשבים ניידים', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500' },
        
        // אביזרי אודיו
        { name: 'AirPods Pro 2nd Gen', desc: 'אוזניות AirPods Pro דור 2', price: 999, stock: 100, cat: 'אביזרי אודיו', img: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500' },
        { name: 'AirPods Max', desc: 'אוזניות AirPods Max פרימיום', price: 2499, stock: 20, cat: 'אביזרי אודיו', img: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500' },
        { name: 'Sony WH-1000XM5', desc: 'אוזניות Sony WH-1000XM5 עם ביטול רעשים', price: 1399, stock: 45, cat: 'אביזרי אודיו', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
        { name: 'Bose QuietComfort Ultra', desc: 'אוזניות Bose QuietComfort Ultra', price: 1599, stock: 35, cat: 'אביזרי אודיו', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
        
        // קונסולות משחק
        { name: 'PlayStation 5 Slim', desc: 'קונסולת PlayStation 5 Slim', price: 2499, stock: 25, cat: 'קונסולות משחק', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500' },
        { name: 'Xbox Series X', desc: 'קונסולת Xbox Series X', price: 2299, stock: 30, cat: 'קונסולות משחק', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500' },
        { name: 'Nintendo Switch OLED', desc: 'קונסולת Nintendo Switch OLED', price: 1599, stock: 35, cat: 'קונסולות משחק', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500' },
        { name: 'Meta Quest 3 512GB', desc: 'משקפי מציאות מדומה Meta Quest 3', price: 2799, stock: 20, cat: 'קונסולות משחק', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500' },
        
        // מצלמות
        { name: 'Canon EOS R6 Mark II', desc: 'מצלמת Canon EOS R6 Mark II', price: 12999, stock: 8, cat: 'מצלמות', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500' },
        { name: 'Sony A7 IV', desc: 'מצלמת Sony A7 IV', price: 11999, stock: 10, cat: 'מצלמות', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500' },
        { name: 'DJI Mini 4 Pro', desc: 'רחפן DJI Mini 4 Pro עם מצלמה 4K', price: 3999, stock: 15, cat: 'מצלמות', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500' },
        { name: 'GoPro Hero 12 Black', desc: 'מצלמת אקסטרים GoPro Hero 12 Black', price: 1999, stock: 30, cat: 'מצלמות', img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500' },
        
        // אביזרי Apple
        { name: 'Apple Watch Series 9 45mm', desc: 'שעון חכם Apple Watch Series 9', price: 1999, stock: 40, cat: 'אביזרי Apple', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500' },
        { name: 'Apple Watch Ultra 2', desc: 'שעון חכם Apple Watch Ultra 2', price: 3999, stock: 15, cat: 'אביזרי Apple', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500' },
        { name: 'iPad Pro 12.9" M2', desc: 'אייפד פרו 12.9 אינץ עם שבב M2', price: 5499, stock: 15, cat: 'אביזרי Apple', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
        { name: 'Apple Pencil 2nd Gen', desc: 'עט Apple Pencil דור 2', price: 549, stock: 50, cat: 'אביזרי Apple', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500' },
      ];
      
      for (const p of products) {
        const categoryId = catMap[p.cat];
        if (!categoryId) continue;
        
        const result = await client.query(
          `INSERT INTO products (name, description, price, stock, category_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [p.name, p.desc, p.price, p.stock, categoryId]
        );
        
        const productId = result.rows[0].id;
        
        // Add image
        await client.query(
          `INSERT INTO images (product_id, image_url, is_main) VALUES ($1, $2, true)`,
          [productId, p.img]
        );
      }
      
      console.log(`✅ נוספו ${products.length} מוצרים`);
    } else {
      console.log(`✅ קיימים ${count} מוצרים במסד הנתונים`);
    }
    
    // Display products summary
    const summary = await client.query(`
      SELECT c.name as category, COUNT(p.id) as count 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      GROUP BY c.name 
      ORDER BY count DESC
    `);
    
    console.log('\nסיכום מוצרים לפי קטגוריה:');
    summary.rows.forEach(s => {
      console.log(`  ${s.category}: ${s.count} מוצרים`);
    });
    
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setupProducts()
  .then(() => {
    console.log('\n✅ הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ נכשל:', err);
    process.exit(1);
  });
