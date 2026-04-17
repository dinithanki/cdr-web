import { Link } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const AdminNavbar = () => {
  const { logout } = useAuthStore();

  return (
    <div className="w-64 h-screen bg-base-200 p-4 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold mb-6">🛠️ Admin</h1>

        <nav className="flex flex-col gap-3">
          <Link to="/admin/dashboard" className="flex gap-2 items-center">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link to="/admin/menu" className="flex gap-2 items-center">
            🍽️ Menu
          </Link>

          <Link to="/admin/users" className="flex gap-2 items-center">
            <Users className="w-4 h-4" />
            Users
          </Link>
        </nav>
      </div>

      {/* BOTTOM */}
      <button onClick={logout} className="btn btn-sm flex gap-2">
        <LogOut className="w-4 h-4" />
        Logout
      </button>

    </div>
  );
};

export default AdminNavbar;