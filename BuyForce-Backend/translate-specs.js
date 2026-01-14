const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

// Translation map from Hebrew to English
const translations = {
  '??????': 'Display',
  '????????': 'Processor',
  '??????????': 'Storage',
  '??????????': 'Camera',
  '??????????': 'Memory',
  '????????': 'Weight',
  '?????? ????????': 'Battery Life',
  '??????????': 'Video',
  '????????????????': 'Resolution',
  'ISO': 'ISO',
};

async function translateSpecs() {
  try {
    console.log('🌐 Translating specs to English...\n');
    
    // Get all specs
    const result = await pool.query('SELECT * FROM specs');
    const specs = result.rows;
    
    console.log(`📊 Found ${specs.length} specs\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const spec of specs) {
      const englishKey = translations[spec.spec_key] || spec.spec_key;
      
      if (englishKey !== spec.spec_key) {
        await pool.query(
          'UPDATE specs SET spec_key = $1 WHERE id = $2',
          [englishKey, spec.id]
        );
        console.log(`✅ Translated: "${spec.spec_key}" → "${englishKey}"`);
        updated++;
      } else {
        skipped++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Translated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📦 Total: ${specs.length}`);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

translateSpecs();
