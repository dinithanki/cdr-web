import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    deliveryFee: {
      type: Number,
      default: 350,
    },

    taxPercentage: {
      type: Number,
      default: 0,
    },

    serviceCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Settings", settingsSchema);
