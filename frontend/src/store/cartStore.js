import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

const CART_STORAGE_KEY = "cart";

const readStoredCart = () => {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch (error) {
    return [];
  }
};

const writeStoredCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const normalizeProduct = (product) => ({
  productId: String(product._id),
  name: product.name,
  price: Number(product.price) || 0,
  image: product.image || "",
  size: product.size || "",
  category: product.category || "",
  qty: 1,
});

const mergeItems = (items) => {
  const map = new Map();

  items.forEach((item) => {
    const current = map.get(item.productId);

    if (current) {
      map.set(item.productId, {
        ...current,
        qty: current.qty + item.qty,
      });
      return;
    }

    map.set(item.productId, { ...item });
  });

  return [...map.values()];
};

const saveCartToServer = async (items) => {
  const res = await axiosInstance.put("/users/cart", { items });
  return res.data.items || [];
};

const clearServerCart = async () => {
  await axiosInstance.delete("/users/cart");
};

export const useCartStore = create((set, get) => ({
  items: [],
  isDrawerOpen: false,
  isCartSyncing: false,

  openCartDrawer: () => set({ isDrawerOpen: true }),
  closeCartDrawer: () => set({ isDrawerOpen: false }),

  getCartCount: () =>
    get().items.reduce((total, item) => total + Number(item.qty || 0), 0),

  getCartSubtotal: () =>
    get().items.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.qty || 0),
      0,
    ),

  setCartItems: (items, persist = true) => {
    set({ items });

    if (persist) {
      writeStoredCart(items);
    }
  },

  hydrateGuestCart: () => {
    const storedCart = readStoredCart();
    set({ items: storedCart });
    return storedCart;
  },

  syncAuthenticatedCart: async () => {
    set({ isCartSyncing: true });

    try {
      const guestCart = readStoredCart();

      if (guestCart.length > 0) {
        const res = await axiosInstance.post("/users/cart/merge", {
          items: guestCart,
        });

        const mergedItems = res.data.items || [];
        set({ items: mergedItems });
        writeStoredCart(mergedItems);
        return mergedItems;
      }

      const res = await axiosInstance.get("/users/cart");
      const serverCart = res.data.items || [];
      set({ items: serverCart });
      writeStoredCart(serverCart);
      return serverCart;
    } finally {
      set({ isCartSyncing: false });
    }
  },

  addItem: async (product, options = {}) => {
    const nextItem = normalizeProduct(product);
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      (item) => item.productId === nextItem.productId,
    );

    const nextItems = [...currentItems];

    if (existingIndex >= 0) {
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        qty: nextItems[existingIndex].qty + 1,
      };
    } else {
      nextItems.push(nextItem);
    }

    set({ items: nextItems });
    writeStoredCart(nextItems);

    if (options.persistToServer) {
      await saveCartToServer(nextItems);
    }

    return nextItems;
  },

  updateQuantity: async (productId, quantity, options = {}) => {
    const currentItems = get().items;
    const nextItems = currentItems
      .map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, Number(quantity) || 1) }
          : item,
      )
      .filter(Boolean);

    set({ items: nextItems });
    writeStoredCart(nextItems);

    if (options.persistToServer) {
      await saveCartToServer(nextItems);
    }

    return nextItems;
  },

  removeItem: async (productId, options = {}) => {
    const nextItems = get().items.filter(
      (item) => item.productId !== productId,
    );
    set({ items: nextItems });
    writeStoredCart(nextItems);

    if (options.persistToServer) {
      await saveCartToServer(nextItems);
    }

    return nextItems;
  },

  replaceItems: async (items, options = {}) => {
    const nextItems = mergeItems(items);
    set({ items: nextItems });
    writeStoredCart(nextItems);

    if (options.persistToServer) {
      await saveCartToServer(nextItems);
    }

    return nextItems;
  },

  clearCart: async (options = {}) => {
    set({ items: [] });
    writeStoredCart([]);

    if (options.persistToServer) {
      await clearServerCart();
    }
  },

  resetCart: () => {
    set({ items: [], isDrawerOpen: false, isCartSyncing: false });
    localStorage.removeItem(CART_STORAGE_KEY);
  },
}));
