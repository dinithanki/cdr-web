import { useAuthStore } from "../store/authStore.js";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  User,
  ShoppingBag,
  ClipboardList,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useCartStore } from "../store/cartStore.js";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { openCartDrawer, getCartCount } = useCartStore();
  const cartCount = getCartCount();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* RIGHT - Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
          >
            <UtensilsCrossed className="size-4" />
            <span className="hidden sm:inline">Menu</span>
          </Link>

          <Link
            to="/promotions"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
          >
            <ClipboardList className="size-4" />
            <span className="hidden sm:inline">Promotions</span>
          </Link>

          {authUser && (
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
            >
              <ClipboardList className="size-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
          )}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((s) => !s)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
            >
              <span className="hidden sm:inline">More</span>
              <ChevronDown className="size-4" />
            </button>

            {moreOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded bg-white text-slate-800 shadow-lg z-50">
                <Link
                  to="/reviews"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100"
                >
                  Reviews
                </Link>
                <Link
                  to="/catering"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100"
                >
                  Catering Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-orange-600 shadow">
                {cartCount}
              </span>
            )}
          </button>

          {authUser ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
            >
              <User className="size-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-block px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-white/20 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-block px-4 py-1.5 text-sm font-medium bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile - Hamburger and Cart */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center p-2"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-orange-600 shadow">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-red-700 px-4 py-4 space-y-3 border-t border-white/20">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
          >
            Menu
          </Link>

          <Link
            to="/promotions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
          >
            Promotions
          </Link>

          {authUser && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Orders
            </Link>
          )}

          {/* More submenu on mobile */}
          <div>
            <button
              onClick={() => setMoreOpen((s) => !s)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 transition flex items-center justify-between"
            >
              More
              <ChevronDown
                className={`size-4 transition ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  to="/reviews"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  Reviews
                </Link>
                <Link
                  to="/catering"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  Catering Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          {authUser ? (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg bg-white text-orange-600 hover:bg-orange-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
