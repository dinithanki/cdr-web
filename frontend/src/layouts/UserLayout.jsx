import Navbar from "../components/Navbar";
import { Outlet, Navigate } from "react-router-dom";
import CartDrawer from "../components/CartDrawer.jsx";
import Footer from "../components/products/Footer.jsx";
import { useAuthStore } from "../store/authStore.js";

function UserLayout() {
  const { authUser } = useAuthStore();

  if (authUser?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />

      {/* IMPORTANT: matches h-16 navbar */}
      <main className="pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;
