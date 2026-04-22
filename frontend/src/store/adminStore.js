import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
  users: [],
  loading: false,

  // 📌 GET USERS
  getUsers: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/users");

      set({ users: res.data });
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      set({ loading: false });
    }
  },

  // 📌 DELETE USER
  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);

      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));

      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  },

  // 📌 UPDATE USER (edit modal)
  updateUser: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/users/admin-update/${id}`, data);

      set((state) => ({
        users: state.users.map((u) => (u._id === id ? res.data : u)),
      }));

      toast.success("User updated");
      return res.data;
    } catch (err) {
      toast.error("Update failed");
      return null;
    }
  },
}));
