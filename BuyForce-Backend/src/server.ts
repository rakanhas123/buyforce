import "dotenv/config";
import express from "express";
import cors from "cors";

import productsRoutes from "./routes/products.routes";
import groupsRoutes from "./routes/groups.routes";
import paymentsRoutes from "./routes/payment.routes";
import authRoutes from "./routes/auth.routes";
import { dbHealthCheck } from "./db/db";
import { webhookHandler } from "./routes/stripe-webhook"
import authRouter from "./routes/auth.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import adminGroupsRoutes from "./routes/admin.groups.routes";
import adminUsersRoutes from "./routes/admin.users.routes";
import adminWishlistRoutes from "./routes/admin.wishlist.routes";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // keep only if you use cookies/auth
  })
);

// IMPORTANT: Stripe webhook routes typically require raw body,
// but since we don’t know your Stripe setup now, keep JSON global.
// If you later add Stripe webhooks, handle that specific route with express.raw().
app.post("/v1/payments/webhook", express.raw({ type: "application/json" }), webhookHandler);
app.use(express.json());

/* =========================================
   API Routes (v1)
========================================= */
app.use("/v1/admin/groups", adminGroupsRoutes);
app.use("/v1/admin/users", adminUsersRoutes);
app.use("/v1/admin/wishlist", adminWishlistRoutes);
app.use("/v1/products", productsRoutes);
app.use("/v1/groups", groupsRoutes);
app.use("/v1/payments", paymentsRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/auth", authRouter);
app.use("/v1/wishlist", wishlistRoutes);
/* =========================================
   Health
========================================= */
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

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
