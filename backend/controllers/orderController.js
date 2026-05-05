import crypto from "crypto";
import Order from "../models/order.js";
import Settings from "../models/settings.js";

const formatAmount = (value) => Number(Number(value || 0).toFixed(2));

const calculatePricing = (subtotal, settings, discount = 0) => {
  const subtotalValue = formatAmount(subtotal);
  const deliveryFee = formatAmount(settings?.deliveryFee || 0);
  const tax = formatAmount(
    (subtotalValue * Number(settings?.taxPercentage || 0)) / 100,
  );
  const service = formatAmount(
    (subtotalValue * Number(settings?.serviceCharge || 0)) / 100,
  );
  const discountValue = formatAmount(discount);
  const totalAmount = Math.max(
    0,
    subtotalValue + deliveryFee + tax + service - discountValue,
  );

  return {
    subtotal: subtotalValue,
    deliveryFee,
    tax,
    service,
    discount: discountValue,
    totalAmount,
  };
};

const splitName = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "Customer", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const buildPayHereSignature = (merchantId, orderId, amount, currency) => {
  const merchantSecretHash = crypto
    .createHash("md5")
    .update(process.env.PAYHERE_MERCHANT_SECRET || "")
    .digest("hex")
    .toUpperCase();

  return crypto
    .createHash("md5")
    .update(`${merchantId}${orderId}${amount}${currency}${merchantSecretHash}`)
    .digest("hex")
    .toUpperCase();
};

const createOrderRecord = async ({ req, body, paymentStatus = "PENDING" }) => {
  const {
    items,
    subtotal,
    discount = 0,
    name,
    phone,
    address,
    paymentMethod,
  } = body;

  const settings = await Settings.findOne();
  const pricing = calculatePricing(subtotal, settings, discount);

  const order = await Order.create({
    userId: req.user?._id || null,
    items,
    subtotal: pricing.subtotal,
    deliveryFee: pricing.deliveryFee,
    tax: pricing.tax,
    discount: pricing.discount,
    totalAmount: pricing.totalAmount,
    name,
    phone,
    address,
    paymentMethod,
    paymentStatus,
    orderStatus: "PENDING",
  });

  return { order, pricing };
};

// 🟢 CREATE ORDER (COD)
export const createOrder = async (req, res) => {
  try {
    // Prevent blocked users from creating orders
    if (req.user && req.user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked and cannot place orders" });
    }
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const { order } = await createOrderRecord({ req, body: req.body });

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message || "Error creating order" });
  }
};

// 💳 CREATE PAYHERE PAYMENT SESSION (CARD)
export const createPayHerePayment = async (req, res) => {
  try {
    // Prevent blocked users from creating orders/payments
    if (req.user && req.user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked and cannot place orders" });
    }
    const merchantId = String(process.env.PAYHERE_MERCHANT_ID || "").trim();
    const merchantSecret = String(
      process.env.PAYHERE_MERCHANT_SECRET || "",
    ).trim();
    const currency = String(process.env.PAYHERE_CURRENCY || "LKR").trim();
    const sandbox =
      String(process.env.PAYHERE_SANDBOX || "false").trim() === "true";
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const serverUrl =
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

    if (!merchantId || !merchantSecret) {
      return res.status(500).json({
        message:
          "PayHere merchant credentials are missing. Set PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET.",
      });
    }

    if (req.body.paymentMethod !== "CARD") {
      return res.status(400).json({ message: "Card payment is required" });
    }

    const { order, pricing } = await createOrderRecord({
      req,
      body: req.body,
    });

    const amount = formatAmount(pricing.totalAmount).toFixed(2);
    const signature = buildPayHereSignature(
      merchantId,
      order._id.toString(),
      amount,
      currency,
    );
    const { firstName, lastName } = splitName(order.name);
    const paymentItems = (order.items || [])
      .map((item) => `${item.name} x ${item.quantity}`)
      .join(", ");

    const payment = {
      sandbox,
      merchant_id: merchantId,
      return_url: `${clientUrl}/orders`,
      cancel_url: `${clientUrl}/checkout`,
      notify_url: `${serverUrl}/api/orders/payment/notify`,
      order_id: order._id.toString(),
      items: paymentItems || "Food order",
      amount,
      currency,
      first_name: firstName,
      last_name: lastName,
      email: req.user?.email || "",
      phone: order.phone || "",
      address: order.address || "",
      city: "Colombo",
      country: "Sri Lanka",
      hash: signature,
      custom_1: order._id.toString(),
      custom_2: order.paymentMethod,
    };

    res.json({ order, payment });
  } catch (error) {
    console.error("PayHere payment creation error:", error);
    res.status(500).json({
      message: error.message || "Error creating PayHere payment",
    });
  }
};

// 🟢 GET user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
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

// 💳 PAYMENT NOTIFY (PayHere callback)
export const markAsPaid = async (req, res) => {
  try {
    const merchantId = String(process.env.PAYHERE_MERCHANT_ID || "").trim();
    const merchantSecret = String(
      process.env.PAYHERE_MERCHANT_SECRET || "",
    ).trim();

    if (!merchantId || !merchantSecret) {
      return res.status(500).send("PayHere credentials not configured");
    }

    const orderId = req.body.order_id || req.body.custom_1;
    const amount = formatAmount(
      req.body.payhere_amount || req.body.amount,
    ).toFixed(2);
    const currency = req.body.payhere_currency || req.body.currency || "LKR";
    const statusCode = String(req.body.status_code || "");
    const md5sig = String(req.body.md5sig || "").toLowerCase();

    const expectedSignature = crypto
      .createHash("md5")
      .update(
        `${merchantId}${orderId}${amount}${currency}${statusCode}${crypto
          .createHash("md5")
          .update(merchantSecret)
          .digest("hex")
          .toUpperCase()}`,
      )
      .digest("hex")
      .toUpperCase();

    if (md5sig && md5sig.toUpperCase() !== expectedSignature) {
      return res.status(400).send("Invalid PayHere signature");
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      statusCode === "2"
        ? {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          }
        : {
            paymentStatus: "FAILED",
          },
      { new: true },
    );

    if (!order) {
      return res.status(404).send("Order not found");
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    return res.status(500).send("Payment notification failed");
  }
};
