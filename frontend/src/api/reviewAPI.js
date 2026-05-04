import { axiosInstance } from "./axios.js";

// Create a new review
export const submitReview = async (orderId, rating, comment) => {
  try {
    const response = await axiosInstance.post("/reviews", {
      orderId,
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's reviews
export const getUserReviews = async () => {
  try {
    const response = await axiosInstance.get("/reviews/user/my-reviews");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get approved reviews
export const getApprovedReviews = async () => {
  try {
    const response = await axiosInstance.get("/reviews/approved");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user's review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
