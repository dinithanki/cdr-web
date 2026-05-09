import { useState } from "react";
import LottieModule from "lottie-react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";
import resetAnimation from "../../assets/reset.json";

const Lottie = LottieModule.default || LottieModule;

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await axiosInstance.post("/users/reset-password", {
        token,
        password,
      });

      toast.success("Password updated successfully");

      // delay so user can see message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">
            Reset Password 🔑
          </h2>
          <p className="text-gray-500 mt-1">Enter your new password below</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* New Password */}
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
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

      {/* RIGHT SIDE - ANIMATION */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-orange-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(253,224,71,0.28),_transparent_40%)]" />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10 text-center">
          <div className="w-full max-w-xl">
            <Lottie
              animationData={resetAnimation}
              loop
              autoplay
              aria-label="Reset password animation"
              className="mx-auto w-full"
            />
          </div>

          <div className="mt-4 text-gray-800">
            <h1 className="text-4xl font-bold">Fresh Start</h1>
            <p className="mt-3 text-lg text-gray-600">
              Secure your account with a new password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
