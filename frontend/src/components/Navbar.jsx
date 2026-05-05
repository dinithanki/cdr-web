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
    <header className="fixed top-0 left-0 z-50 w-full bg-linear-to-r from-orange-700 via-orange-600 to-red-600 text-white shadow-2xl border-b border-red-700/50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LEFT - Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tight text-white">
              Dragon Dine
            </h1>
            <p className="text-xs text-white/90 font-semibold">
              Premium Delivery
            </p>
          </div>
        </Link>

        {/* RIGHT - Desktop Actions */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition duration-200"
          >
            <UtensilsCrossed className="size-4" />
            <span>Menu</span>
          </Link>

          <Link
            to="/promotions"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition duration-200"
          >
            <ClipboardList className="size-4" />
            <span>Promotions</span>
          </Link>

          {authUser && (
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition duration-200"
            >
              <ClipboardList className="size-4" />
              <span>Orders</span>
            </Link>
          )}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((s) => !s)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition duration-200"
            >
              <span>More</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-orange-600 text-white shadow-2xl z-50 border border-orange-700 overflow-hidden">
                <Link
                  to="/catering"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-orange-700 transition duration-200 border-b border-orange-700 last:border-b-0"
                >
                  Catering Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-orange-700 transition duration-200 border-b border-orange-700 last:border-b-0"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-orange-700 transition duration-200 border-b border-orange-700 last:border-b-0"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          <div className="mx-2 w-px h-6 bg-white/30" />

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-200"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-red-600 px-1 text-[10px] font-black leading-5 text-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {authUser ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white/20 text-white hover:bg-white/30 transition duration-200 ml-1"
            >
              <User className="size-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white/80 hover:bg-white/20 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold bg-white text-orange-700 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition duration-200 ml-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile - Hamburger and Cart */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center p-2 text-orange-400 hover:bg-slate-700/50 rounded-lg transition duration-200"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-4 h-4 rounded-full bg-red-600 px-0.5 text-[9px] font-black leading-4 text-white shadow-lg flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition duration-200"
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
        <div className="md:hidden bg-linear-to-b from-orange-600 to-orange-700 px-4 py-4 space-y-2 border-t border-red-600/50">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
          >
            <UtensilsCrossed className="size-4" />
            Menu
          </Link>

          <Link
            to="/promotions"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
          >
            <ClipboardList className="size-4" />
            Promotions
          </Link>

          {authUser && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
            >
              <ClipboardList className="size-4" />
              Orders
            </Link>
          )}

          <div className="border-t border-white/20 my-2 pt-2">
            <button
              onClick={() => setMoreOpen((s) => !s)}
              className="w-full text-left flex items-center justify-between px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
            >
              More
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {moreOpen && (
              <div className="ml-2 mt-2 space-y-2 border-l-2 border-white/30 pl-4">
                <Link
                  to="/catering"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
                >
                  Catering Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-white/20 my-2 pt-2">
            {authUser ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
              >
                <User className="size-4" />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 mt-2 rounded-lg bg-white text-orange-700 font-semibold hover:shadow-lg transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
