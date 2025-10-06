// paymentRoute.js
import express from "express";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

// Only order creation route
router.post("/create-order", createOrder);

export default router;
