import { useState, useEffect } from "react";
import LottieModule from "lottie-react";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";
import signupAnimation from "../../assets/signup.json";

const Lottie = LottieModule.default || LottieModule;

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
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-1">
            Join and start managing your restaurant
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* First + Last Name */}
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              {isSigningUp ? "Signing up..." : "Sign Up"}
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
            onClick={googleLogin}
            disabled={loading}
            className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            {loading ? "Loading..." : "Continue with Google"}
          </button>

          {/* Login redirect */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-500 cursor-pointer hover:underline"
            >
              Login
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
              animationData={signupAnimation}
              loop
              autoplay
              aria-label="Online groceries signup animation"
              className="mx-auto w-full"
            />
          </div>

          <div className="mt-4 text-gray-800">
            <h1 className="text-4xl font-bold">Join Our Food Platform</h1>
            <p className="mt-3 text-lg text-gray-600">
              Grow your restaurant with us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
