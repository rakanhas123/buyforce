import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connections: using Postgres pool from `src/db` when needed.

// --------------------
// Background workers
// --------------------
import './notification.worker';

// --------------------
// API Routes (v1)
// --------------------
import productsRoutes from './routes/products.routes';

// Base API version: /v1
app.use('/v1/products', productsRoutes);

// --------------------
// Health Check
// --------------------
app.get('/v1/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'BuyForce Backend',
    version: 'v1',
  });
});

// --------------------
// Server start
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 BuyForce backend running on port ${PORT}`);
  console.log(`📡 API base URL: http://localhost:${PORT}/v1`);
});
