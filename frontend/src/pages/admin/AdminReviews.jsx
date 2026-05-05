import { useEffect, useState } from "react";
import { Star, Check, X, ChevronDown } from "lucide-react";
import { useReviewStore } from "../../store/reviewStore.js";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

export default function AdminReviews() {
  const {
    reviews,
    loading,
    submitting,
    getAllReviews,
    approveReview,
    rejectReview,
  } = useReviewStore();
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actingReviewId, setActingReviewId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        await getAllReviews();
      } catch (err) {
        setError(err.message || "Failed to load reviews");
      }
    };

    fetchReviews();
  }, [getAllReviews]);

  const handleApprove = async (reviewId) => {
    setActingReviewId(reviewId);
    try {
      await approveReview(reviewId);
    } catch (err) {
      setError(err.message || "Failed to approve review");
    } finally {
      setActingReviewId(null);
    }
  };

  const handleReject = async (reviewId) => {
    setActingReviewId(reviewId);
    try {
      await rejectReview(reviewId);
    } catch (err) {
      setError(err.message || "Failed to reject review");
    } finally {
      setActingReviewId(null);
    }
  };

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.status === filter);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Review Management
          </h1>
          <p className="text-gray-600 mt-2">
            Moderate and manage customer reviews
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "all"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "pending"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Pending ({reviews.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "approved"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Approved ({reviews.filter((r) => r.status === "approved").length})
          </button>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* User & Date */}
                    <div className="flex items-center gap-3 mb-3">
                      {review.userId?.profilePic && (
                        <img
                          src={review.userId.profilePic}
                          alt={review.userId?.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.userId?.firstName} {review.userId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.userId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Rating & Date */}
                    <div className="flex items-center gap-3 mb-3">
                      <div>{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadge(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    )}

                    {/* Order Items */}
                    {review.orderId?.items && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <p className="font-semibold text-gray-900 mb-2">
                          Order Items:
                        </p>
                        <ul className="space-y-1">
                          {review.orderId.items.map((item, idx) => (
                            <li key={idx} className="text-gray-600">
                              {item.name} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === review._id ? null : review._id,
                        )
                      }
                      disabled={actingReviewId === review._id || submitting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:bg-gray-300 disabled:text-gray-600 transition font-medium"
                    >
                      Change Status
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === review._id && (
                      <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                        <button
                          onClick={() => {
                            handleApprove(review._id);
                            setOpenDropdown(null);
                          }}
                          disabled={actingReviewId === review._id || submitting}
                          className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700 font-medium transition flex items-center gap-2 border-b"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleReject(review._id);
                            setOpenDropdown(null);
                          }}
                          disabled={actingReviewId === review._id || submitting}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 font-medium transition flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
