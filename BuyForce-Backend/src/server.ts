import "dotenv/config";
import express from "express";
import cors from "cors";

/* ===============================
   Routes Imports
================================ */
import productsRoutes from "./routes/products.routes";
import groupsRoutes from "./routes/groups.routes";
import authRoutes from "./routes/auth.routes";
import wishlistRoutes from "./routes/wishlist.routes";

import adminGroupsRoutes from "./routes/admin.groups.routes";
import adminUsersRoutes from "./routes/admin.users.routes";
import adminWishlistRoutes from "./routes/admin.wishlist.routes";

import paypalRoutes from "./payments/paypal.routes";

import { dbHealthCheck } from "./db/db";

/* ===============================
   App Init
================================ */
const app = express();

/* ===============================
   Middleware
================================ */
app.use(
  cors({
    origin: true, // allow all in development
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   API Routes
================================ */
app.use("/api/products", productsRoutes);

app.use("/v1/groups", groupsRoutes);
app.use("/v1/payments/paypal", paypalRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/wishlist", wishlistRoutes);

app.use("/v1/admin/groups", adminGroupsRoutes);
app.use("/v1/admin/users", adminUsersRoutes);
app.use("/v1/admin/wishlist", adminWishlistRoutes);

/* ===============================
   Health Check
================================ */
app.get("/v1/health", async (_req, res) => {
  try {
    const dbOk = await dbHealthCheck();
    res.json({
      status: "OK",
      service: "BuyForce Backend",
      version: "v1",
      db: dbOk ? "OK" : "FAIL",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "FAIL",
      service: "BuyForce Backend",
      version: "v1",
      db: "FAIL",
      error: err?.message ?? "unknown error",
    });
  }
});

/* ===============================
   Server Start
================================ */
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`✅ Server running on http://${host}:${port}`);
  console.log(`📱 For mobile device, use your computer's IP address`);
});
