import pool from "./db";

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

createAuditLogsTable();
