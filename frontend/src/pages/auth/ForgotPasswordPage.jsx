import { useState } from "react";
import LottieModule from "lottie-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import forgotPasswordAnimation from "../../assets/fogetpassword.json";

const Lottie = LottieModule.default || LottieModule;

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
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
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

      {/* RIGHT SIDE - ANIMATION */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-orange-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(253,224,71,0.28),_transparent_40%)]" />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10 text-center">
          <div className="w-full max-w-xl">
            <Lottie
              animationData={forgotPasswordAnimation}
              loop
              autoplay
              aria-label="Forgot password security animation"
              className="mx-auto w-full"
            />
          </div>

          <div className="mt-4 text-gray-800">
            <h1 className="text-4xl font-bold">Secure Your Account</h1>
            <p className="mt-3 text-lg text-gray-600">
              We'll help you get back in safely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
