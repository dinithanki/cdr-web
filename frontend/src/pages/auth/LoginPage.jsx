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
    <div className="mt-72">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        <span className="mx-2"> </span>
        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Loading..." : "Continue with Google"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
