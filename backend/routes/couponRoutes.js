import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  createCoupon,
  getCoupons,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// 🟢 Admin creates coupon
router.post("/", protect, adminOnly, createCoupon);

// 🟢 Admin gets coupons
router.get("/", protect, adminOnly, getCoupons);

// 🟡 Public (checkout page)
router.post("/validate", validateCoupon);

export default router;
