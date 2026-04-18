import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const { signup, isSigningUp, googleLogin, loading, authUser } =
    useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (authUser?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return;

    await signup(form);
  };

  // Redirect to dashboard if user is already authenticated

  return (
    <div className="mt-72">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />

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

        <button type="submit" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          type="button"
          onClick={googleLogin}
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue with Google"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
