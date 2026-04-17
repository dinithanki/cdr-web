import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/public/HomePage.jsx";
import Login from "./pages/auth/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SignUpPage from "./pages/auth/SignupPage.jsx";
import { Navigate } from "react-router-dom";
import Cart from "./components/cart.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/cart" element={<div>Cart Page</div>} />
      </Routes>
    </div>
  );
};

export default App;
