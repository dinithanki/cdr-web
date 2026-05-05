import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "", // optional (controller will handle fallback)
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    preparationTime: {
      type: Number,
      required: true,
      min: 15,
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      default: "Medium",
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
