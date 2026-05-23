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
  MessageSquare,
  UserCircle2,
} from "lucide-react";

import { useAuthStore } from "../store/authStore.js";

const AdminSidebar = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-700 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-4 shadow-2xl">
      {/* LOGO / HEADER */}
      <div className="rounded-xl bg-linear-to-r from-orange-600 to-red-600 p-4 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-white">Admin</h2>
        <p className="text-xs text-orange-100 tracking-widest uppercase font-semibold mt-1">
          Control Panel
        </p>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 space-y-2">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          Dashboard
        </p>
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/dashboard")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-semibold">Dashboard</span>
        </Link>

        <p className="px-3 py-3 mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Management
        </p>

        <Link
          to="/admin/users"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/users")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Users size={20} />
          <span className="font-semibold">Users</span>
        </Link>

        <Link
          to="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/products")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Utensils size={20} />
          <span className="font-semibold">Products</span>
        </Link>

        <Link
          to="/admin/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/orders")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <ShoppingBag size={20} />
          <span className="font-semibold">Orders</span>
        </Link>

        <Link
          to="/admin/reviews"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/reviews")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Star size={20} />
          <span className="font-semibold">Reviews</span>
        </Link>

        <Link
          to="/admin/coupons"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/coupons")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <TicketPercent size={20} />
          <span className="font-semibold">Coupons</span>
        </Link>

        <Link
          to="/admin/messages"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/messages")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <MessageSquare size={20} />
          <span className="font-semibold">Messages</span>
        </Link>

        <p className="px-3 py-3 mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Settings
        </p>

        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/settings")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Settings size={20} />
          <span className="font-semibold">Settings</span>
        </Link>

        <Link
          to="/admin/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isActive("/admin/profile")
              ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <UserCircle2 size={20} />
          <span className="font-semibold">Profile</span>
        </Link>
      </nav>

      {/* LOGOUT (BOTTOM) */}
      <button
        onClick={logout}
        className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 text-red-300 border border-red-600/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition duration-200 font-semibold"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
