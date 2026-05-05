import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Replied", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
