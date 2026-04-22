import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore.js";
import { useAuthStore } from "../../store/authStore.js";

export default function AdminUsers() {
  const { users, loading, getUsers, deleteUser, updateUser } = useAdminStore();
  const { authUser } = useAuthStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 🔍 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "user",
    isBlocked: false,
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // 🔥 FILTER LOGIC
  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && user.isBlocked) ||
      (statusFilter === "active" && !user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      role: user.role || "user",
      isBlocked: Boolean(user.isBlocked),
    });
  };

  const closeEditModal = () => setSelectedUser(null);
  const openViewModal = (user) => setViewUser(user);
  const closeViewModal = () => setViewUser(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isBlocked" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    setIsSaving(true);
    const updatedUser = await updateUser(selectedUser._id, formData);
    setIsSaving(false);

    if (updatedUser) closeEditModal();
  };

  const getFullName = (user) =>
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No name";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "Not available";

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <p className="text-sm text-gray-500">Manage registered users.</p>
      </div>

      {/* FILTER BAR */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 md:w-1/3"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          No users found in system.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No users match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t text-sm text-gray-700">
                    <td className="px-4 py-3">{getFullName(user)}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => openViewModal(user)}
                        className="mr-2 rounded-lg bg-slate-600 px-3 py-2 text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEditModal(user)}
                        className="mr-2 rounded-lg bg-blue-500 px-3 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* (MODALS UNCHANGED — KEEP YOUR EXISTING ONES) */}
    </div>
  );
}
