import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import groupsRouter from "./routes/groups";
import pool from "./db";

// Load environment variables
dotenv.config();

/* ===========================================
   CREATE TABLES ON SERVER START
=========================================== */

// 1) audit_logs table
async function createAuditLogsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✔ audit_logs table is ready");
  } catch (err) {
    console.error("Error creating audit_logs table:", err);
  }
}

// 2) products table
async function createProductsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✔ products table is ready");
  } catch (err) {
    console.error("Error creating products table:", err);
  }
}

// 3) groups table
async function createGroupsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP
      );
    `);
    console.log("✔ groups table is ready");
  } catch (err) {
    console.error("Error creating groups table:", err);
  }
}

// Run all table creators
async function initTables() {
  await createAuditLogsTable();
  await createProductsTable();
  await createGroupsTable();
}
initTables();

/* ===========================================
   Create Express App
=========================================== */

const app = express();

app.use(cors());
app.use(express.json());

// Payments
import paymentsRouter from './payments/payments.routes';
app.use('/payments', paymentsRouter);

// Regular products routes
import productsRoutes from './routes/products.routes';
app.use('/api/products', productsRoutes);

// Admin products routes
import productsAdminRoutes from "./routes/products.admin.routes";
app.use("/api/products", productsAdminRoutes);


// Groups routes
app.use('/api/groups', groupsRouter);


// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'BuyForce Backend' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BuyForce backend running on port ${PORT}`));
