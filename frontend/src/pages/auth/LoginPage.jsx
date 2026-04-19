import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const { googleLogin, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    console.log("Login successful, checking user role...");
    const user = await login(form);
    console.log("Logged in user:", user);

    if (user?.role === "admin") {
      console.log("Admin logged in, navigating to dashboard");
      navigate("/admin/dashboard");
    } else {
      navigate("/");
      console.log("User logged in, navigating to home");
    }
  };
  const handleGoogleLogin = async () => {
    const user = await googleLogin();

    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back </h2>
          <p className="text-gray-500 mt-1">Login to your restaurant account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Forgot */}
            <div className="flex justify-end">
              <p
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-orange-500 cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t"></div>
            <span className="mx-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            {loading ? "Loading..." : "Continue with Google"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE / BRAND */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="restaurant"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl font-bold">Delicious Moments 🍽️</h1>
            <p className="mt-3 text-lg">Manage your restaurant with ease</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
