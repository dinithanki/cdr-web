import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],

    // 💰 pricing
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    discount: Number,
    totalAmount: Number,

    // 📍 delivery info
    name: String,
    phone: String,
    address: String,

    // 💳 payment
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
