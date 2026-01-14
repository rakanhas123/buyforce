import { Router } from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "./paypal.controller";

const router = Router();

router.post("/create", createPayPalOrder);
router.post("/capture", capturePayPalOrder);

export default router;
