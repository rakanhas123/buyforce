import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

/* ==========================================
   Stripe Webhook (⚠️ MUST BE BEFORE json)
========================================== */
import stripeWebhookRoutes from "./routes/stripe.webhook";

// ⚠️ חשוב: raw body רק ל־Stripe
app.use(
  "/v1/webhooks",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookRoutes
);

/* ==========================================
   Global Middlewares
========================================== */
app.use(cors());
app.use(express.json());

/* ==========================================
   Background workers
========================================== */
import "./notification.worker";

/* ==========================================
   API Routes (v1)
========================================== */
import productsRoutes from "./routes/products.routes";
import groupsRoutes from "./routes/groups.routes";
import paymentsRoutes from "./routes/payments.routes";

app.use("/v1/products", productsRoutes);
app.use("/v1/groups", groupsRoutes);
app.use("/v1/payments", paymentsRoutes);

/* ==========================================
   Health Check
========================================== */
app.get("/v1/health", (_req, res) => {
  res.json({
    status: "OK",
    service: "BuyForce Backend",
    version: "v1",
  });
});

/* ==========================================
   Server start
========================================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 BuyForce backend running on port ${PORT}`);
  console.log(`📡 API base URL: http://localhost:${PORT}/v1`);
});
