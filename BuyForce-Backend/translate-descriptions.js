const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

// English descriptions for products
const descriptions = {
  1: 'Powerful business laptop with high performance',
  2: 'Latest smartphone model with advanced features',
  3: 'Latest Apple iPhone with cutting-edge technology',
  4: 'Samsung flagship phone with premium specs',
  5: 'Apple lightweight laptop perfect for productivity',
  6: 'Sony noise-canceling headphones with exceptional sound quality',
  7: 'iPhone 15 Pro Max 256GB with A17 Pro chip, 6.7" display, and titanium design',
  8: 'iPhone 15 Pro 128GB with A17 Pro chip and 6.1" Super Retina XDR display',
  9: 'MacBook Air 15" with M3 chip, 16GB RAM, 512GB SSD',
  10: 'MacBook Air 13" with M3 chip, 8GB RAM, 256GB SSD',
  11: 'MacBook Pro 16" M3 Max with 36GB RAM, 1TB SSD, professional performance',
  12: 'iPad Pro 12.9" M2 with Liquid Retina XDR display and Apple Pencil support',
  13: 'iPad Air 11" M2 chip, perfect balance of performance and portability',
  14: 'AirPods Pro 2nd Gen with active noise cancellation and spatial audio',
  15: 'AirPods Max over-ear headphones with premium sound quality',
  16: 'Apple Watch Series 9 45mm with advanced health tracking features',
  17: 'Apple Watch Ultra 2 rugged titanium design for extreme activities',
  18: 'Magic Keyboard for iPad Pro with backlit keys and trackpad',
  19: 'Apple Pencil 2nd Gen with wireless charging and double-tap gesture',
  20: 'Samsung Galaxy S24 Ultra with 6.8" display and Snapdragon 8 Gen 3',
  21: 'Samsung Galaxy S24+ with 6.7" display and premium features',
  22: 'Samsung Galaxy Buds2 Pro wireless earbuds with active noise cancellation',
  23: 'Samsung Galaxy Watch6 Classic smartwatch with rotating bezel',
  24: 'Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation',
  25: 'Sony WF-1000XM5 true wireless earbuds with exceptional sound',
  26: 'Bose QuietComfort Ultra premium noise-canceling headphones',
  27: 'PlayStation 5 Slim gaming console with 1TB storage',
  28: 'PlayStation 5 Digital Edition without disc drive',
  29: 'Xbox Series X gaming console with 1TB storage and 4K gaming',
  30: 'Xbox Series S compact gaming console with 512GB storage',
  31: 'Nintendo Switch OLED with vibrant 7" OLED screen',
  32: 'Meta Quest 3 512GB mixed reality VR headset',
  33: 'Meta Quest 3 128GB affordable mixed reality experience',
  34: 'DJI Mini 4 Pro compact drone with 4K video recording',
  35: 'DJI Air 3 drone with dual cameras and extended flight time',
  36: 'GoPro Hero 12 Black action camera with 5.3K video',
  37: 'DJI Osmo Action 4 rugged action camera for extreme sports',
  38: 'Canon EOS R6 Mark II mirrorless camera with 24.2MP sensor',
  39: 'Sony A7 IV full-frame mirrorless camera for professionals',
  40: 'Canon RF 24-70mm f/2.8 L IS USM professional zoom lens',
  41: 'Sony FE 24-70mm f/2.8 GM II versatile zoom lens',
  42: 'Dell XPS 15 9530 premium laptop with Intel i7-13700H and RTX 4060',
  43: 'Dell XPS 13 Plus ultraportable laptop with Intel i7 and 13.4" display',
  44: 'LG UltraFine 32" 4K monitor with ergonomic arm mount',
  45: 'Samsung Odyssey G9 49" curved gaming monitor with ultra-wide display',
  46: 'Logitech MX Master 3S wireless productivity mouse',
  47: 'Logitech MX Keys wireless keyboard for advanced typing',
  48: 'Keychron K8 Pro wireless mechanical keyboard',
  49: 'Keychron Q1 Pro premium mechanical keyboard with hot-swap switches',
  50: 'Dyson V15 Detect cordless vacuum with laser detection',
  51: 'Dyson Airwrap multi-styler for hair styling',
  52: 'iRobot Roomba j7+ robot vacuum with self-emptying base',
  53: 'Ninja Air Fryer Max 5.5L for healthy cooking',
  54: 'Vitamix A3500 professional blender for smoothies',
  55: 'Nespresso Vertuo Next coffee machine for espresso',
  56: 'Garmin Fenix 7X multisport GPS watch for athletes',
  57: 'Wahoo KICKR Smart Trainer for indoor cycling',
  58: 'Sonos Beam Gen 2 compact smart soundbar',
  59: 'Sonos Sub Mini wireless subwoofer for deep bass',
  60: 'Philips Hue Play Gradient smart ambient lighting for TV',
  61: 'Ring Video Doorbell Pro 2 smart doorbell with HD video',
  62: 'Kindle Paperwhite Signature Edition e-reader with warm light',
  63: 'Remarkable 2 digital notebook for note-taking',
  64: 'Anker 757 PowerHouse 1229Wh portable power station',
  65: 'Herman Miller Aeron ergonomic office chair',
  66: 'Uplift V2 Standing Desk electric height-adjustable desk',
  67: 'BenQ ScreenBar Halo monitor light bar for eye comfort',
};

async function updateDescriptions() {
  try {
    console.log('📝 Updating product descriptions to English...\n');
    
    let updated = 0;
    
    for (const [id, description] of Object.entries(descriptions)) {
      await pool.query(
        'UPDATE products SET description = $1 WHERE id = $2',
        [description, parseInt(id)]
      );
      console.log(`✅ Updated product ${id}: ${description.substring(0, 50)}...`);
      updated++;
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated} products`);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updateDescriptions();
