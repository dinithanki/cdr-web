import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  // 📌 GET (USER)
  getProducts: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/products");

      set({ products: res.data.data }); // ✅ important
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      set({ loading: false });
    }
  },

  // 📌 GET (ADMIN)
  getProductsAdmin: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/products/admin/all");

      set({ products: res.data.data }); // ✅ important
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      set({ loading: false });
    }
  },

  // 📌 CREATE PRODUCT
  createProduct: async (formData) => {
    try {
      const res = await axiosInstance.post("/products", formData);

      set((state) => ({
        products: [res.data.product, ...state.products], // ✅ prepend
      }));

      toast.success(res.data.message || "Product created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  },

  // 📌 UPDATE PRODUCT
  updateProduct: async (id, formData) => {
    try {
      const res = await axiosInstance.put(`/products/${id}`, formData);

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? res.data.product : p,
        ),
      }));

      toast.success(res.data.message || "Product updated");
      return res.data.product;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return null;
    }
  },

  // 📌 DELETE PRODUCT
  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));

      toast.success("Product deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  },
}));
