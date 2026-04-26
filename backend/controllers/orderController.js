import Order from "../models/order.js";
import Settings from "../models/settings.js";

// 🟢 CREATE ORDER (COD + CARD)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      discount = 0,
      couponCode,
      name,
      phone,
      address,
      paymentMethod,
    } = req.body;

    // ⚙️ get settings (delivery, tax, service)
    const settings = await Settings.findOne();

    const deliveryFee = settings?.deliveryFee || 0;
    const tax = (subtotal * (settings?.taxPercentage || 0)) / 100;
    const service = (subtotal * (settings?.serviceCharge || 0)) / 100;

    const totalAmount = subtotal + deliveryFee + tax + service - discount;

    const order = await Order.create({
      userId: req.user?._id || null,
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      name,
      phone,
      address,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
    });

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message || "Error creating order" });
  }
};

// 🟢 GET user orders
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};

// 🟡 GET ALL ORDERS (ADMIN ONLY)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 🟡 UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status },
    { new: true },
  );

  res.json(order);
};

// 💳 PAYMENT SUCCESS (PayHere callback)
export const markAsPaid = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    },
    { new: true },
  );

  res.json(order);
};
