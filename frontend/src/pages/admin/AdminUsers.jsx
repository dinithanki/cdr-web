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
    const email = (user.email || "").toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(normalizedSearch) || email.includes(normalizedSearch);

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

  const handleDelete = async (user) => {
    if (!user?._id) return;

    const shouldDelete = window.confirm(
      `Delete ${getFullName(user)}? This action cannot be undone.`,
    );

    if (!shouldDelete) return;
    await deleteUser(user._id);
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
                        onClick={() => handleDelete(user)}
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

      {/* VIEW MODAL */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                User Details
              </h2>
              <button
                onClick={closeViewModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">Name:</span>{" "}
                {getFullName(viewUser)}
              </p>
              <p>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                {viewUser.email || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Phone:</span>{" "}
                {viewUser.phoneNumber || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Address:</span>{" "}
                {viewUser.address || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Role:</span>{" "}
                <span className="capitalize">{viewUser.role || "user"}</span>
              </p>
              <p>
                <span className="font-medium text-gray-900">Status:</span>{" "}
                {viewUser.isBlocked ? "Blocked" : "Active"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Joined:</span>{" "}
                {formatDate(viewUser.createdAt)}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewModal}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
              <button
                onClick={closeEditModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="rounded-lg border px-3 py-2 md:col-span-2"
                required
              />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className="rounded-lg border px-3 py-2"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="rounded-lg border px-3 py-2"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                name="isBlocked"
                value={String(formData.isBlocked)}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="false">Active</option>
                <option value="true">Blocked</option>
              </select>

              <div className="md:col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
