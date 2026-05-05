import { Outlet, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";

const AuthLayout = () => {
  const { authUser } = useAuthStore();

  if (authUser) {
    if (authUser.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
    // <div className="min-h-screen flex flex-col">
    //   {/* Minimal top bar */}
    //   <div className="p-4">
    //     <Link to="/" className="text-xl font-bold">
    //       Dinith
    //     </Link>
    //   </div>

    //   {/* Page content */}
    //   <div className="flex-1 flex items-center justify-center">
    //     <Outlet />
    //   </div>
    // </div>
  );
};

export default AuthLayout;
