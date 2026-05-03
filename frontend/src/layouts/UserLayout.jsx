import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import CartDrawer from "../components/CartDrawer.jsx";
import Footer from "../components/products/Footer.jsx";

function UserLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />

      {/* IMPORTANT: matches h-16 navbar */}
      <main className="pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;
