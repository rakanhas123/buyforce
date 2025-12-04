const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "buyforce-postgres",
  database: process.env.PGDATABASE || "buyforce",
  password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || "postgres",
  port: parseInt(process.env.PGPORT, 10) || 5432
});

module.exports = pool;
