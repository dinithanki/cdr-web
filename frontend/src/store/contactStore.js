import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useContactStore = create((set, get) => ({
  contacts: [],
  myContacts: [],
  isLoading: false,
  error: null,

  // User: Submit a contact message
  submitContactForm: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/contacts", contactData);
      set((state) => ({
        myContacts: [...state.myContacts, res.data.contact],
      }));
      toast.success("Message sent successfully!");
      return res.data.contact;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // User: Get their own contact messages
  fetchMyContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/contacts/my");
      set({ myContacts: res.data.contacts });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch your messages";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin: Get all contacts
  fetchAllContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/contacts");
      set({ contacts: res.data.contacts });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch all messages";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin: Update contact status
  updateContactStatus: async (id, statusData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/contacts/${id}`, statusData);
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact._id === id ? res.data.contact : contact,
        ),
      }));
      toast.success("Contact status updated!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin: Delete a contact message
  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/contacts/${id}`);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact._id !== id),
        myContacts: state.myContacts.filter((contact) => contact._id !== id),
      }));
      toast.success("Contact message deleted!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete message";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));
