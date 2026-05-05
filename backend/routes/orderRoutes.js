import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

import {
  createOrder,
  createPayHerePayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  markAsPaid,
} from "../controllers/orderController.js";

const router = express.Router();

// 🟢 Create order (USER must be logged in)
router.post("/", protect, createOrder);

// 💳 Create PayHere payment session for card checkout
router.post("/payment/payhere", protect, createPayHerePayment);

// 🟡 Get all orders (ADMIN only)
router.get("/admin/all", protect, adminOnly, getAllOrders);

// 🟢 Get user orders (USER only)
router.get("/", protect, getUserOrders);

// 🟡 Update order status (ADMIN only)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// 💳 Payment callback (NO protect - PayHere calls it)
router.post("/payment/notify", markAsPaid);
router.post("/payment/success", markAsPaid);

export default router;
