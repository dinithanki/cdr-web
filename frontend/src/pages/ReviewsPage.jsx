import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useReviewStore } from "../store/reviewStore.js";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ReviewsPage() {
  const { approvedReviews, loading, getApprovedReviews } = useReviewStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        await getApprovedReviews();
      } catch (err) {
        setError(err.message || "Failed to load reviews");
      }
    };

    fetchReviews();
  }, [getApprovedReviews]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Reviews
        </h1>
        <p className="text-gray-600 mb-8">
          See what our customers think about our products
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {approvedReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No reviews yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approvedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.userId?.firstName} {review.userId?.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  {review.userId?.profilePic && (
                    <img
                      src={review.userId.profilePic}
                      alt={review.userId?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>

                {/* Rating */}
                <div className="mb-3">{renderStars(review.rating)}</div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* Items */}
                {review.orderId?.items && review.orderId.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Ordered:
                    </p>
                    <div className="space-y-1">
                      {review.orderId.items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {item.name} (x{item.quantity})
                        </p>
                      ))}
                      {review.orderId.items.length > 2 && (
                        <p className="text-xs text-gray-600">
                          +{review.orderId.items.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
