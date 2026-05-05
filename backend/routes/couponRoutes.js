import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

import {
  createCoupon,
  getCoupons,
  getActiveCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// 🟢 Admin creates coupon
router.post("/", protect, adminOnly, createCoupon);

// 🟢 Admin gets coupons
router.get("/", protect, adminOnly, getCoupons);

// 🟢 Admin updates coupon
router.put("/:id", protect, adminOnly, updateCoupon);

// 🟡 Public - Get active coupons (promotions page) - MUST be before GET /
router.get("/active/list", getActiveCoupons);

// 🟡 Public (checkout page)
router.post("/validate", validateCoupon);

export default router;
