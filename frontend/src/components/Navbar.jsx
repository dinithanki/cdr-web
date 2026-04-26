import { useAuthStore } from "../store/authStore.js";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  User,
  LogOut,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { useCartStore } from "../store/cartStore.js";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { openCartDrawer, getCartCount } = useCartStore();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LEFT - Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight">Dragon Dine</h1>
            <p className="text-xs text-orange-100">Premium Food Delivery</p>
          </div>
        </Link>

        {/* RIGHT - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!authUser && (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-block px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-block px-4 py-1.5 text-sm font-medium bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
          >
            <UtensilsCrossed className="size-4" />
            <span className="hidden sm:inline">Menu</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/orders"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
              >
                <ClipboardList className="size-4" />
                <span className="hidden sm:inline">Orders</span>
              </Link>

              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-orange-600 shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
