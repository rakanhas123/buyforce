const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// Middleware
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║           🛍️  BuyForce Frontend             ║');
    console.log('║                                              ║');
    console.log(`║  http://localhost:${PORT}            ║`);
    console.log('║  http://10.212.134.46:8000               ║');
    console.log('║                                              ║');
    console.log('║  ✅ Frontend Ready!                          ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('\n');
});
