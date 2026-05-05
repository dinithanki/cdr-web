import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useReviewStore = create((set) => ({
  reviews: [],
  userReviews: [],
  approvedReviews: [],
  loading: false,
  submitting: false,

  // Submit a new review
  submitReview: async (orderId, rating, comment) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.post("/reviews", {
        orderId,
        rating,
        comment,
      });
      toast.success(res.data.message || "Review submitted successfully!");
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to submit review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Get user's own reviews
  getUserReviews: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reviews/user/my-reviews");
      set({ userReviews: res.data.data || [] });
      return res.data.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Get all approved reviews (public)
  getApprovedReviews: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reviews/approved");
      set({ approvedReviews: res.data.data || [] });
      return res.data.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Get reviews for a specific product
  getProductReviews: async (productId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/reviews/product/${productId}`);
      return res.data.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Delete a review (user's own)
  deleteReview: async (reviewId) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success(res.data.message || "Review deleted successfully!");
      // Refresh user reviews
      const updated = await axiosInstance.get("/reviews/user/my-reviews");
      set({ userReviews: updated.data.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Admin: Get all reviews
  getAllReviews: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reviews/admin/all");
      set({ reviews: res.data.data || [] });
      return res.data.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Admin: Approve a review
  approveReview: async (reviewId) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.patch(`/reviews/${reviewId}/approve`);
      toast.success(res.data.message || "Review approved!");
      // Refresh all reviews
      const updated = await axiosInstance.get("/reviews/admin/all");
      set({ reviews: updated.data.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to approve review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Admin: Reject a review
  rejectReview: async (reviewId) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.patch(`/reviews/${reviewId}/reject`);
      toast.success(res.data.message || "Review rejected!");
      // Refresh all reviews
      const updated = await axiosInstance.get("/reviews/admin/all");
      set({ reviews: updated.data.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to reject review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Update a review (user's own)
  updateReview: async (reviewId, rating, comment) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.patch(`/reviews/${reviewId}`, {
        rating,
        comment,
      });
      toast.success(res.data.message || "Review updated successfully!");
      // Refresh user reviews
      const updated = await axiosInstance.get("/reviews/user/my-reviews");
      set({ userReviews: updated.data.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Admin: Delete a review
  deleteReviewAdmin: async (reviewId) => {
    set({ submitting: true });
    try {
      const res = await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success(res.data.message || "Review deleted!");
      // Refresh all reviews
      const updated = await axiosInstance.get("/reviews/admin/all");
      set({ reviews: updated.data.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete review";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  // Get pending reviews count
  getPendingCount: async () => {
    try {
      const res = await axiosInstance.get("/reviews/admin/pending-count");
      return res.data.data?.pendingCount || 0;
    } catch (error) {
      return 0;
    }
  },
}));
