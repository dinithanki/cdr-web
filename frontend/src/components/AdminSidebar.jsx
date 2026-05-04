import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Utensils,
  TicketPercent,
  Star,
} from "lucide-react";

import { useAuthStore } from "../store/authStore.js";

const AdminSidebar = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-base-200 flex flex-col p-4 bg-red-700">
      {/* LOGO / TITLE */}
      <div className="text-xl font-bold mb-8">Admin Panel</div>

      {/* NAV ITEMS */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${
            isActive("/admin/dashboard") ? "bg-base-300 font-semibold" : ""
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${
            isActive("/admin/users") ? "bg-base-300 font-semibold" : ""
          }`}
        >
          <Users size={18} />
          Users
        </Link>

        <Link
          to="/admin/products"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${
            isActive("/admin/products") ? "bg-base-300 font-semibold" : ""
          }`}
        >
          <Utensils size={18} />
          Products
        </Link>
        <Link
          to="/admin/orders"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${isActive("/admin/orders") ? "bg-base-300 font-semibold" : ""}`}
        >
          <ShoppingBag size={18} />
          Orders
        </Link>
        <Link
          to="/admin/reviews"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${isActive("/admin/reviews") ? "bg-base-300 font-semibold" : ""}`}
        >
          <Star size={18} />
          Reviews
        </Link>
        <Link
          to="/admin/coupons"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${isActive("/admin/coupons") ? "bg-base-300 font-semibold" : ""}`}
        >
          <TicketPercent size={18} />
          Coupons
        </Link>
        <Link
          to="/admin/settings"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${
            isActive("/admin/settings") ? "bg-base-300 font-semibold" : ""
          }`}
        >
          <Settings size={18} />
          Settings
        </Link>
        <Link
          to="/admin/profile"
          className={`flex items-center gap-2 p-2 rounded hover:bg-base-300 ${
            isActive("/admin/profile") ? "bg-base-300 font-semibold" : ""
          }`}
        >
          <Settings size={18} />
          Profile
        </Link>
      </nav>

      {/* LOGOUT (BOTTOM) */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-2 p-2 rounded hover:bg-red-500 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
