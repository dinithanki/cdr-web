import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { useReviewStore } from "../../store/reviewStore.js";
import {
  ChevronDown,
  Package,
  Star,
  Trash2,
  Edit2,
  AlertCircle,
} from "lucide-react";
import ReviewModal from "../../components/ReviewModal.jsx";
import toast from "react-hot-toast";
import { confirmAction } from "../../utils/confirmAction.js";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatStatus = (status) => {
  const statusMap = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  const colors = {
    PENDING: "bg-yellow-50 border-yellow-200 text-yellow-700",
    CONFIRMED: "bg-blue-50 border-blue-200 text-blue-700",
    PREPARING: "bg-purple-50 border-purple-200 text-purple-700",
    OUT_FOR_DELIVERY: "bg-indigo-50 border-indigo-200 text-indigo-700",
    DELIVERED: "bg-green-50 border-green-200 text-green-700",
    CANCELLED: "bg-red-50 border-red-200 text-red-700",
  };
  return colors[status] || "bg-gray-50 border-gray-200 text-gray-700";
};

const StarRating = ({ rating, onRate, interactive = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          disabled={!interactive}
          className={`transition-all ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          }`}
        >
          <Star
            size={20}
            className={`${
              star <= (hovered || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

function Orders() {
  const { getUserOrders } = useAuthStore();
  const { getUserReviews, deleteReview, updateReview } = useReviewStore();
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [editingComment, setEditingComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const ordersData = await getUserOrders();
      const reviewsData = await getUserReviews();
      setOrders(ordersData);
      setUserReviews(reviewsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleReviewSubmitSuccess = async () => {
    const reviewsData = await getUserReviews();
    setUserReviews(reviewsData);
  };

  const getOrderReview = (orderId) => {
    return userReviews.find((review) => review.orderId?._id === orderId);
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditingRating(review.rating);
    setEditingComment(review.comment);
  };

  const handleSaveReview = async (reviewId) => {
    if (editingRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await updateReview(reviewId, editingRating, editingComment);
      setEditingReviewId(null);
      const reviewsData = await getUserReviews();
      setUserReviews(reviewsData);
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const shouldDelete = await confirmAction({
      title: "Delete review?",
      message: "Are you sure you want to delete this review?",
      confirmText: "Delete",
      cancelText: "Keep review",
      variant: "danger",
    });

    if (!shouldDelete) return;

    try {
      await deleteReview(reviewId);
      const reviewsData = await getUserReviews();
      setUserReviews(reviewsData);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-orange-600 animate-bounce" />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h1>
            <p className="text-gray-600 mb-8">
              Start exploring our menu and place your first order
            </p>
            <a
              href="/products"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            You have {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Orders Grid */}
        <div className="space-y-4">
          {orders.map((order) => {
            const review = getOrderReview(order._id);
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrderId(isExpanded ? null : order._id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)} •{" "}
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <div
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.orderStatus)}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 px-6 py-6 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee</span>
                        <span>{formatCurrency(order.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                        <span>Total</span>
                        <span className="text-orange-600">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Delivery Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600">Name</p>
                          <p className="font-medium text-gray-900">
                            {order.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">
                            {order.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">
                            {order.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Review Section */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Review
                      </h3>

                      {!review ? (
                        order.orderStatus === "DELIVERED" ? (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReviewModal(true);
                            }}
                            className="w-full py-3 px-4 bg-orange-50 border-2 border-orange-200 text-orange-600 rounded-lg hover:bg-orange-100 transition font-semibold flex items-center justify-center gap-2"
                          >
                            <Star size={18} />
                            Write a Review
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              You can review this order once it's delivered
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                          {editingReviewId === review._id ? (
                            // Edit Mode
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                  Rating
                                </label>
                                <StarRating
                                  rating={editingRating}
                                  onRate={setEditingRating}
                                  interactive={true}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                  Comment
                                </label>
                                <textarea
                                  value={editingComment}
                                  onChange={(e) =>
                                    setEditingComment(e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                  rows="3"
                                  placeholder="Share your experience..."
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveReview(review._id)}
                                  className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingReviewId(null)}
                                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display Mode
                            <div className="space-y-3">
                              <div>
                                <div className="mb-2">
                                  <StarRating rating={review.rating} />
                                </div>
                                <p className="text-sm text-gray-700">
                                  {review.comment}
                                </p>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="flex-1 py-2 px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm flex items-center justify-center gap-2"
                                >
                                  <Edit2 size={16} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="flex-1 py-2 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center justify-center gap-2"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrder(null);
          }}
          onSubmitSuccess={handleReviewSubmitSuccess}
        />
      )}
    </div>
  );
}

export default Orders;
