import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
  users: [],
  loading: false,
  orders: [],
  ordersLoading: false,
  coupons: [],
  couponsLoading: false,
  settings: null,
  settingsLoading: false,

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

  // 📌 GET ORDERS (ADMIN)
  getAdminOrders: async () => {
    try {
      set({ ordersLoading: true });

      // Fallback list helps if backend uses a different admin orders endpoint.
      const endpoints = ["/orders/admin/all", "/orders/all", "/orders"];
      let fetchedOrders = [];

      for (const endpoint of endpoints) {
        try {
          const res = await axiosInstance.get(endpoint);
          fetchedOrders = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];
          break;
        } catch (error) {
          // Continue trying next endpoint.
        }
      }

      set({ orders: fetchedOrders });
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      set({ ordersLoading: false });
    }
  },

  // 📌 UPDATE ORDER STATUS (ADMIN)
  updateOrderStatus: async (id, status) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/status`, { status });
      const updatedOrder = res.data;

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, ...updatedOrder } : order,
        ),
      }));

      toast.success("Order status updated");
      return updatedOrder;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
      return null;
    }
  },

  // 📌 GET COUPONS
  getCoupons: async () => {
    try {
      set({ couponsLoading: true });
      const res = await axiosInstance.get("/coupons");

      set({
        coupons: Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load coupons");
    } finally {
      set({ couponsLoading: false });
    }
  },

  // 📌 CREATE COUPON
  createCoupon: async (payload) => {
    try {
      const res = await axiosInstance.post("/coupons", payload);
      const createdCoupon = res.data;

      set((state) => ({
        coupons: [createdCoupon, ...state.coupons],
      }));

      toast.success("Coupon created");
      return createdCoupon;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
      return null;
    }
  },

  // 📌 UPDATE COUPON (requires backend endpoint)
  updateCoupon: async (id, payload) => {
    try {
      const res = await axiosInstance.put(`/coupons/${id}`, payload);
      const updatedCoupon = res.data;

      set((state) => ({
        coupons: state.coupons.map((coupon) =>
          coupon._id === id ? { ...coupon, ...updatedCoupon } : coupon,
        ),
      }));

      toast.success("Coupon updated");
      return updatedCoupon;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
      return null;
    }
  },

  // 📌 TOGGLE COUPON ACTIVE
  toggleCouponStatus: async (id, isActive) => {
    try {
      const res = await axiosInstance.put(`/coupons/${id}`, { isActive });
      const updatedCoupon = res.data;

      set((state) => ({
        coupons: state.coupons.map((coupon) =>
          coupon._id === id ? { ...coupon, ...updatedCoupon } : coupon,
        ),
      }));

      toast.success(`Coupon ${isActive ? "activated" : "deactivated"}`);
      return updatedCoupon;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
      return null;
    }
  },

  // 📌 GET SETTINGS
  getSettings: async () => {
    try {
      set({ settingsLoading: true });
      const res = await axiosInstance.get("/settings");
      set({ settings: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load settings");
    } finally {
      set({ settingsLoading: false });
    }
  },

  // 📌 UPDATE SETTINGS
  updateSettings: async (payload) => {
    try {
      const res = await axiosInstance.put("/settings", payload);
      set({ settings: res.data });
      toast.success("Settings updated");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
      return null;
    }
  },
}));
