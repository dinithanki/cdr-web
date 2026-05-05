import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  TicketPercent,
  UserRound,
} from "lucide-react";
import { useAdminStore } from "../../store/adminStore.js";
import { useProductStore } from "../../store/useProductStore.js";

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

const quickActions = [
  { label: "Manage Orders", path: "/admin/orders" },
  { label: "Manage Products", path: "/admin/products" },
  { label: "Manage Users", path: "/admin/users" },
  { label: "Manage Coupons", path: "/admin/coupons" },
];

const AdminDashboard = () => {
  const {
    users,
    loading,
    getUsers,
    orders,
    ordersLoading,
    getAdminOrders,
    coupons,
    couponsLoading,
    getCoupons,
  } = useAdminStore();

  const {
    products,
    loading: productsLoading,
    getProductsAdmin,
  } = useProductStore();

  useEffect(() => {
    getUsers();
    getAdminOrders();
    getCoupons();
    getProductsAdmin();
  }, [getUsers, getAdminOrders, getCoupons, getProductsAdmin]);

  const orderSummary = useMemo(() => {
    const pending = orders.filter((o) => o.orderStatus === "PENDING").length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "DELIVERED",
    ).length;
    const cancelled = orders.filter(
      (o) => o.orderStatus === "CANCELLED",
    ).length;
    const revenue = orders
      .filter((o) => o.orderStatus === "DELIVERED")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      total: orders.length,
      pending,
      delivered,
      cancelled,
      revenue,
    };
  }, [orders]);

  const couponSummary = useMemo(() => {
    const active = coupons.filter((c) => c.isActive).length;
    return {
      total: coupons.length,
      active,
    };
  }, [coupons]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [orders],
  );

  const dashboardLoading =
    loading || ordersLoading || couponsLoading || productsLoading;

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-6">
      <div className="rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-red-50 p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          Admin Overview
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
          Dashboard Control Center
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Monitor orders, users, products, and coupons at a glance, then jump
          directly into management screens.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-orange-300"
            >
              {action.label}
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-700">
            <UserRound className="size-5" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Total Users</p>
          <p className="text-3xl font-black text-slate-900">{users.length}</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
            <ShoppingBag className="size-5" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Total Orders</p>
          <p className="text-3xl font-black text-slate-900">{orders.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            Pending: {orderSummary.pending} | Delivered:{" "}
            {orderSummary.delivered}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-lg bg-green-100 p-2 text-green-700">
            <Package className="size-5" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Products</p>
          <p className="text-3xl font-black text-slate-900">
            {products.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-lg bg-purple-100 p-2 text-purple-700">
            <TicketPercent className="size-5" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Coupons</p>
          <p className="text-3xl font-black text-slate-900">
            {couponSummary.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Active: {couponSummary.active}
          </p>
        </article>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800"
            >
              View all
            </Link>
          </div>

          {dashboardLoading ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              Loading dashboard data...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              No recent orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b text-sm text-slate-700"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        #
                        {String(order._id || "")
                          .slice(-6)
                          .toUpperCase()}
                      </td>
                      <td className="px-4 py-3">{order.name || "Unknown"}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {formatStatus(order.orderStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Business Snapshot
          </h2>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Delivered Revenue
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {formatCurrency(orderSummary.revenue)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                <p className="text-xs text-green-700">Delivered</p>
                <p className="text-xl font-black text-green-800">
                  {orderSummary.delivered}
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-red-700">Cancelled</p>
                <p className="text-xl font-black text-red-800">
                  {orderSummary.cancelled}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs uppercase tracking-wider text-blue-700">
                Order Fulfillment Rate
              </p>
              <p className="mt-1 text-2xl font-black text-blue-800">
                {orderSummary.total
                  ? `${Math.round(
                      (orderSummary.delivered / orderSummary.total) * 100,
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
