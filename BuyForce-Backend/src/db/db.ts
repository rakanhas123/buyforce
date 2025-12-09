import pkg from "pg";
const { Pool } = pkg;

// יצירת Pool עבור PostgreSQL
const db = new Pool({
  host: "localhost",     // או "buyforce-postgres" אם את בתוך Docker
  port: 5432,
  user: "postgres",      // שם משתמש של PostgreSQL
  password: "postgres",  // הסיסמה שהגדרת ב-docker-compose
  database: "postgres",  // שם בסיס הנתונים שלך
});

// בדיקה שהחיבור עובד
db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

export default db;
