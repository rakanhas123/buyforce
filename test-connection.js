#!/usr/bin/env node
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/v1/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Backend Health Check:');
    console.log(JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.end();
