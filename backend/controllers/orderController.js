import Order from "../models/Order.js";
import Settings from "../models/Settings.js";

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
    res.status(500).json({ message: "Error creating order" });
  }
};

// 🟢 GET user orders
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
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
