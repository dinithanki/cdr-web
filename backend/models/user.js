import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true, // removed required
    },

    lastName: {
      type: String,
      trim: true, //removed required
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // add this
      trim: true, //  add this
    },

    password: {
      type: String,
      //  removed required (important for Google users)
    },

    profilePic: {
      type: String,
      default: "",
    },

    // ADD THIS (for Google login)
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    //(store Firebase UID)
    googleId: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },

    resetExpire: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
