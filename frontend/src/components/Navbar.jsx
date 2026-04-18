import { useAuthStore } from "../store/authStore.js";
import { Link } from "react-router-dom";
import { MessageSquare, User, LogOut, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const isAdmin = authUser?.role === "admin";
  const isUser = authUser?.role === "user";
  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-lg bg-red-600">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT - Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Dinith</h1>
        </Link>

        {/* RIGHT - Actions */}

        <div className="flex items-center gap-3">
          {!authUser && (
            <>
              <Link to="/login" className="btn btn-sm px-4">
                Login
              </Link>

              <Link to="/signup" className="btn btn-sm btn-primary px-4">
                Sign Up
              </Link>
            </>
          )}

          {authUser && (
            <>
              <Link
                to="/profile"
                className="btn btn-sm flex items-center gap-2 px-3"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="btn btn-sm flex items-center gap-2 px-3 hover:cursor-pointer"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
          <Link to="/cart" className="btn btn-sm flex items-center gap-2 px-3">
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
