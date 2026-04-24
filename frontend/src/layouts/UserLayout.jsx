import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* IMPORTANT: matches h-16 navbar */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
