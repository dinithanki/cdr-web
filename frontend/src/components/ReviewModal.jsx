import { useState } from "react";
import { Star, X } from "lucide-react";
import { useReviewStore } from "../store/reviewStore.js";

export default function ReviewModal({
  order,
  isOpen,
  onClose,
  onSubmitSuccess,
}) {
  const { submitReview, submitting } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      const result = await submitReview(order._id, rating, comment);
      setSuccess(result.message || "Review submitted successfully!");

      // Reset form
      setRating(0);
      setComment("");

      // Call callback and close after a short delay
      setTimeout(() => {
        onSubmitSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Order ID:</span> #
                {order._id?.slice(-8).toUpperCase()}
              </p>
              <p>
                <span className="font-medium">Items:</span>{" "}
                {order.items?.length} item(s)
              </p>
              <div className="mt-2">
                <p className="font-medium text-gray-900 mb-1">Ordered Items:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="text-gray-600">
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Rate your experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  You rated: {rating} star{rating !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Your Review (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this order..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 transition"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
