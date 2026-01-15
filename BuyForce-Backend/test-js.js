const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Hello from JS!' });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('JS server running on http://0.0.0.0:3000');
});
