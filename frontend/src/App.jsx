import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/public/HomePage.jsx";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SignUpPage from "./pages/auth/SignupPage.jsx";
import { Navigate } from "react-router-dom";
import CartPage from "./pages/cart/CartPage.jsx";
import CheckoutPage from "./pages/cart/CheckoutPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx";
import Orders from "./pages/user/Orders.jsx";
import Promotions from "./pages/user/Promotions.jsx";
import About from "./pages/more/About.jsx";
import Contact from "./pages/more/Contact.jsx";
import Catering from "./pages/more/Catering.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import CouponsPage from "./pages/admin/coupons/CouponsPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminProfileEdit from "./pages/admin/AdminProfileEdit.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import ProductsPage from "./pages/product/ProductsPage.jsx";
import { useCartStore } from "./store/cartStore.js";
import ScrollToTop from "./components/ScrollToTop";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { hydrateGuestCart, syncAuthenticatedCart } = useCartStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (authUser) {
      syncAuthenticatedCart().catch(() => {
        hydrateGuestCart();
      });
      return;
    }

    hydrateGuestCart();
  }, [authUser, hydrateGuestCart, isCheckingAuth, syncAuthenticatedCart]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Toaster position="top-right" />
      <ScrollToTop />

      <Routes>
        {/* USER ROUTES */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/products" element={<ProductsPage />} />

          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={authUser ? <Orders /> : <Navigate to="/login" />}
          />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/catering" element={<Catering />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            authUser?.role === "admin" ? <AdminLayout /> : <Navigate to="/" />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="profile/edit" element={<AdminProfileEdit />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
