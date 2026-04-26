import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
const provider = new GoogleAuthProvider();
import { sendPasswordResetEmail } from "firebase/auth";
import { useCartStore } from "./cartStore.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  loading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return; // stop if user clicks Cancel
    try {
      // 🔥 Backend logout
      await axiosInstance.post("/users/logout");
      // 🔥 Firebase logout (for Google users)
      await signOut(auth).catch(() => {});
      // Clear local auth state
      set({ authUser: null });
      useCartStore.getState().resetCart();

      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  googleLogin: async () => {
    try {
      set({ loading: true });

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      };

      const res = await axiosInstance.post("/users/google-login", userData);

      set({ authUser: res.data, loading: false });

      toast.success("Google login successful!");

      return res.data; // ✅ ADD THIS
    } catch (err) {
      console.log(err);
      set({ loading: false });
      toast.error("Google login failed");
    }
  },
  forgotPassword: async (email) => {
    try {
      set({ loading: true });

      const res = await axiosInstance.post("/users/forgot-password", {
        email,
      });
      toast.success(res.data.message || "Reset email sent");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/users/update-profile", data);

      set({ authUser: res.data }); // update UI globally

      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  getUserOrders: async () => {
    try {
      const res = await axiosInstance.get("/orders");
      return res.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      return [];
    }
  },
}));
