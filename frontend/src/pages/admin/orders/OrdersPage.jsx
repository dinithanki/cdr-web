import { useEffect, useMemo, useState } from "react";
import { useAdminStore } from "../../../store/adminStore.js";
import { formatOrderId } from "../../../utils/orderId.js";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatStatus = (value) =>
  (value || "UNKNOWN")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getStatusClass = (status) => {
  if (status === "DELIVERED") return "bg-green-100 text-green-700";
  if (status === "CANCELLED") return "bg-red-100 text-red-700";
  if (status === "OUT_FOR_DELIVERY") return "bg-indigo-100 text-indigo-700";
  if (status === "CONFIRMED") return "bg-blue-100 text-blue-700";
  if (status === "PREPARING") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

export default function OrdersPage() {
  const { orders, ordersLoading, getAdminOrders, updateOrderStatus } =
    useAdminStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    getAdminOrders();
  }, [getAdminOrders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return orders.filter((order) => {
      const id = String(order._id || "").toLowerCase();
      const name = String(order.name || "").toLowerCase();
      const phone = String(order.phone || "").toLowerCase();

      const matchesSearch =
        id.includes(normalizedSearch) ||
        name.includes(normalizedSearch) ||
        phone.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, paymentFilter, searchTerm, statusFilter]);

  const orderSummary = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === "PENDING").length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "DELIVERED",
    ).length;

    return { total, pending, delivered };
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, status);
    setUpdatingOrderId("");
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "Not available";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-500">
          Track food orders, payment method, and delivery progress.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900">
            {orderSummary.total}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-amber-600">
            {orderSummary.pending}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-semibold text-green-600">
            {orderSummary.delivered}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search by order ID, customer or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Payments</option>
          <option value="COD">COD</option>
          <option value="CARD">CARD</option>
        </select>
      </div>

      {ordersLoading ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          No orders available.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t text-sm text-gray-700"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        #{formatOrderId(order._id)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{order.name || "Not available"}</div>
                      <div className="text-xs text-gray-500">
                        {order.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {order.paymentMethod || "Unknown"}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatStatus(order.paymentStatus)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-slate-600 px-3 py-2 text-white"
                        >
                          View
                        </button>

                        <select
                          value={order.orderStatus || "PENDING"}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          className="rounded-lg border px-3 py-2"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">Order ID:</span>{" "}
                {formatOrderId(selectedOrder._id)}
              </p>
              <p>
                <span className="font-medium text-gray-900">Customer:</span>{" "}
                {selectedOrder.name || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Phone:</span>{" "}
                {selectedOrder.phone || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Address:</span>{" "}
                {selectedOrder.address || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Payment:</span>{" "}
                {selectedOrder.paymentMethod || "Unknown"} (
                {formatStatus(selectedOrder.paymentStatus)})
              </p>
              <p>
                <span className="font-medium text-gray-900">Order Status:</span>{" "}
                {formatStatus(selectedOrder.orderStatus)}
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, index) => (
                    <tr
                      key={`${item.productId || item.name}-${index}`}
                      className="border-t text-sm text-gray-700"
                    >
                      <td className="px-4 py-3">{item.name || "Item"}</td>
                      <td className="px-4 py-3">{item.quantity || 0}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(
                          (item.price || 0) * (item.quantity || 0),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-gray-700 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Subtotal</p>
                <p className="font-semibold">
                  {formatCurrency(selectedOrder.subtotal)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Delivery</p>
                <p className="font-semibold">
                  {formatCurrency(selectedOrder.deliveryFee)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Tax</p>
                <p className="font-semibold">
                  {formatCurrency(selectedOrder.tax)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
