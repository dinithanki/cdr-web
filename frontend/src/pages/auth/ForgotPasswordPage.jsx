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
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow rounded w-96"
      >
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-3 cursor-pointer"
        >
          Back to login
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
