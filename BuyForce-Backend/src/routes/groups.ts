import { Router } from "express";
import db from "../db/db"; // החיבור ל-Postgres שלך

const router = Router();
console.log("Groups router loaded");

// שליפת כל הקבוצות של משתמש
router.get("/users/:userId/groups", async (req, res) => {
    console.log(" ROUTE CALLED with userId =", req.params.userId);
router.get("/test", (req, res) => {
  console.log("🔥 TEST route called!");
  res.json({ message: "TEST OK" });
});

  const userId = req.params.userId;

  try {
    // 1️⃣ שליפת קבוצות של המשתמש
    const groups = await db.query(
      `
      SELECT g.*
      FROM groups g
      JOIN user_groups ug 
        ON g.id = ug.group_id
      WHERE ug.user_id = $1
      `,
      [userId]
    );

    // 2️⃣ מיון לפי סטטוס
    const order = ["active", "pending", "archived"];
    const sortedGroups = groups.rows.sort(
      (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
    );

    // 3️⃣ היסטוריה של כל קבוצה
    const groupIds = sortedGroups.map((g) => g.id);

    const history = await db.query(
      `
      SELECT *
      FROM group_history
      WHERE group_id = ANY($1)
      ORDER BY created_at DESC
      `,
      [groupIds]
    );

    res.json({
      userId,
      groups: sortedGroups,
      history: history.rows,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
