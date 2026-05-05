import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createReview,
  getApprovedReviews,
  getProductReviews,
  getUserReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  updateReview,
  deleteReview,
  getPendingReviewsCount,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.get("/approved", getApprovedReviews);
router.get("/product/:productId", getProductReviews);

// User routes (protected)
router.post("/", protect, createReview);
router.get("/user/my-reviews", protect, getUserReviews);
router.patch("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);

// Admin routes (protected + admin only)
router.get("/admin/all", protect, adminOnly, getAllReviews);
router.patch("/:reviewId/approve", protect, adminOnly, approveReview);
router.patch("/:reviewId/reject", protect, adminOnly, rejectReview);
router.get("/admin/pending-count", protect, adminOnly, getPendingReviewsCount);

export default router;
