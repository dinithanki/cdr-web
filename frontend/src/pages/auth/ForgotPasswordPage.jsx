import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { forgotPassword, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">
            Forgot Password 🔐
          </h2>
          <p className="text-gray-500 mt-1">
            Enter your email to receive a reset link
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-500 cursor-pointer hover:underline"
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
          alt="restaurant"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl font-bold">Secure Your Account 🔒</h1>
            <p className="mt-3 text-lg">We’ll help you get back in safely</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
