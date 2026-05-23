import Review from "../models/review.js";
import Order from "../models/order.js";
import { resolvePublicStorageUrl } from "../utils/storageUrl.js";

const serializeReview = (review) => {
  const reviewObject = review.toObject ? review.toObject() : review;

  if (reviewObject.userId?.profilePic) {
    reviewObject.userId.profilePic = resolvePublicStorageUrl(
      reviewObject.userId.profilePic,
      "users",
      "",
    );
  }

  return reviewObject;
};

// Create a new review (user can only review delivered orders)
export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only review your own orders",
        success: false,
      });
    }

    // Check if order is delivered
    if (order.orderStatus !== "DELIVERED") {
      return res.status(400).json({
        message: "You can only review delivered orders",
        success: false,
      });
    }

    // Check if user already reviewed this order
    const existingReview = await Review.findOne({ orderId, userId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this order",
        success: false,
      });
    }

    // Create review
    const review = await Review.create({
      orderId,
      userId,
      rating,
      comment: comment || "",
      status: "pending",
    });

    return res.status(201).json({
      message: "Review submitted successfully and is pending approval",
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get all approved reviews (public)
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .populate("userId", "firstName lastName profilePic")
      .populate("orderId", "items")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ status: "approved" })
      .populate({
        path: "orderId",
        match: { "items.productId": productId },
      })
      .populate("userId", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    // Filter out reviews where the product wasn't in the order
    const filteredReviews = reviews.filter((review) => review.orderId !== null);

    return res.status(200).json({
      success: true,
      data: filteredReviews.map(serializeReview),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get user's own reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ userId })
      .populate("orderId", "items totalAmount orderStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Admin: Get all reviews (for moderation)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "firstName lastName email profilePic")
      .populate("orderId", "items totalAmount")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Admin: Approve a review
export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "approved" },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Review approved successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Admin: Reject a review
export const rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "rejected" },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Review rejected successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// User: Update their own review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only update your own reviews",
        success: false,
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// User: Delete their own review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own reviews",
        success: false,
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get pending reviews count (for admin dashboard)
export const getPendingReviewsCount = async (req, res) => {
  try {
    const count = await Review.countDocuments({ status: "pending" });

    return res.status(200).json({
      success: true,
      data: { pendingCount: count },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
