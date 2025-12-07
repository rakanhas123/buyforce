import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());

//  Connect to MongoDB
import { connectMongo } from './db/mongo';
// connect at startup (async)
connectMongo().catch(err => {
  console.error('Mongo connection error on startup:', err);
});

//  Load background workers (IMPORTANT)
import './notification.worker';

//  Routes (example)
import productsRoutes from './routes/products.routes';
app.use('/api/products', productsRoutes);

//  Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'BuyForce Backend',
  });
});

//  Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BuyForce backend running on port ${PORT}`);
});
