const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testAPI() {
  console.log('בודק API endpoints...\n');
  
  // Test categories
  try {
    const result = await testEndpoint('/api/categories');
    console.log('✅ /api/categories:', result.status);
    if (Array.isArray(result.data)) {
      console.log(`   מצא ${result.data.length} קטגוריות`);
      result.data.forEach(cat => console.log(`     - ${cat.name}`));
    }
  } catch (err) {
    console.log('❌ /api/categories:', err.message);
  }
  
  console.log();
  
  // Test groups
  try {
    const result = await testEndpoint('/api/groups');
    console.log('✅ /api/groups:', result.status);
    if (Array.isArray(result.data)) {
      console.log(`   מצא ${result.data.length} קבוצות`);
    } else if (result.data.items) {
      console.log(`   מצא ${result.data.items.length} קבוצות`);
    }
  } catch (err) {
    console.log('❌ /api/groups:', err.message);
  }
  
  console.log();
  
  // Test products
  try {
    const result = await testEndpoint('/api/products');
    console.log('✅ /api/products:', result.status);
    if (result.data.items) {
      console.log(`   מצא ${result.data.items.length} מוצרים`);
    }
  } catch (err) {
    console.log('❌ /api/products:', err.message);
  }
  
  console.log('\n✅ הבדיקה הושלמה!');
}

setTimeout(() => testAPI().then(() => process.exit(0)).catch(() => process.exit(1)), 500);
