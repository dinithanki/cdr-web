import Cart from "../models/cart.js";
import { resolvePublicStorageUrl } from "../utils/storageUrl.js";

const resolveCartItemImage = (image) =>
  resolvePublicStorageUrl(image, "products", image || "");

const normalizeItem = (item) => {
  if (!item) return null;

  const productId = String(item.productId || item._id || "");
  const qty = Number(item.qty) || 1;

  if (!productId || qty < 1) return null;

  return {
    productId,
    name: item.name || "",
    price: Number(item.price) || 0,
    image: resolveCartItemImage(item.image),
    size: item.size || "",
    category: item.category || "",
    qty,
  };
};

const normalizeItems = (items = []) => items.map(normalizeItem).filter(Boolean);

const mergeItems = (existingItems = [], incomingItems = []) => {
  const map = new Map();

  [...existingItems, ...incomingItems].forEach((item) => {
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

const getOrCreateCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (cart) return cart;

  return Cart.create({ userId, items: [] });
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).lean();
    return res.json({ items: normalizeItems(cart?.items || []) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const items = normalizeItems(req.body.items);

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, items },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.json({ message: "Cart updated", items: cart.items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const mergeCart = async (req, res) => {
  try {
    const incomingItems = normalizeItems(req.body.items);

    if (!incomingItems.length) {
      const cart = await getOrCreateCart(req.user._id);
      return res.json({ message: "Cart merged", items: cart.items });
    }

    const existingCart = await Cart.findOne({ userId: req.user._id });
    const mergedItems = mergeItems(existingCart?.items || [], incomingItems);

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, items: mergedItems },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.json({ message: "Cart merged", items: cart.items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, items: [] },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
