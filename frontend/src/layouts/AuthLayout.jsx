import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const AuthLayout = () => {
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
