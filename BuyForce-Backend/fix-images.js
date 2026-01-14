const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

// Map products to real image URLs from Unsplash
const imageMap = {
  'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  'Tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80',
  'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  'Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'Camera': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
  'Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  'iPhone': 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80',
  'MacBook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  'iPad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  'AirPods': 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80',
  'Apple Watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
  'Magic Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'Apple Pencil': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
  'Samsung Galaxy': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
  'Galaxy Buds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  'Galaxy Watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
  'Sony WH': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
  'Sony WF': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  'Bose': 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&q=80',
  'PlayStation': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
  'Xbox': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80',
  'Nintendo Switch': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80',
  'Meta Quest': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80',
  'DJI': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80',
  'GoPro': 'https://images.unsplash.com/photo-1626729921778-c1dd6e6edc63?w=400&q=80',
  'Canon': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  'Dell XPS': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
  'LG UltraFine': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  'Samsung Odyssey': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80',
  'Logitech': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  'Keychron': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'Dyson': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80',
  'iRobot Roomba': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80',
  'Ninja': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&q=80',
  'Vitamix': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
  'Nespresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80',
  'Garmin': 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=400&q=80',
  'Wahoo': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
  'Sonos': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'Philips Hue': 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&q=80',
  'Ring': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80',
  'Kindle': 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=400&q=80',
  'Remarkable': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  'Anker': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  'Herman Miller': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80',
  'Uplift': 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&q=80',
  'BenQ': 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&q=80',
};

async function fixImages() {
  try {
    console.log('🔧 Fixing product images...\n');
    
    // Get all products
    const productsResult = await pool.query('SELECT id, name FROM products ORDER BY id');
    const products = productsResult.rows;
    
    console.log(`📦 Found ${products.length} products\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      // Find matching image based on product name
      let imageUrl = null;
      
      for (const [keyword, url] of Object.entries(imageMap)) {
        if (product.name.includes(keyword)) {
          imageUrl = url;
          break;
        }
      }
      
      // Default image if no match found
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';
      }
      
      // Update main image for this product
      const result = await pool.query(
        `UPDATE images SET image_url = $1 WHERE product_id = $2 AND is_main = true`,
        [imageUrl, product.id]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ Updated: ${product.name} (ID: ${product.id})`);
        updated++;
      } else {
        console.log(`⏭️  Skipped: ${product.name} (ID: ${product.id}) - No main image found`);
        skipped++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📦 Total: ${products.length}`);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fixImages();
