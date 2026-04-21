import User from "../models/user.js";
import { uploadProfileImage } from "../services/uploadService.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../services/emailService.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user",
      provider: "local",
    });

    await newUser.save();

    generateToken(
      {
        id: newUser._id,
        role: newUser.role,
      },
      res,
    );

    return res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Error in signup controller" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.provider === "google" && !user.password) {
      return res.status(400).json({
        message: "Please login with Google",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(
      {
        id: user._id,
        role: user.role,
      },
      res,
    );
    console.log("User logged in:", user.email);

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Error in login controller" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error in logout controller",
    });
  }
};
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(user);
};
export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({
      message: "User promoted to admin successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    res.status(500).json({ message: "Error in checkAuth controller" });
  }
};
export const googleLogin = async (req, res) => {
  try {
    const { email, name, photo, uid } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    //If user exists → link Google if not linked
    if (user) {
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
      }

      generateToken(
        {
          id: user._id,
          role: user.role,
        },
        res,
      );

      return res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      });
    }

    //New user → create account
    user = await User.create({
      email,
      firstName: name,
      profilePic: photo,
      googleId: uid,
      provider: "google",
      role: "user",
    });

    generateToken(
      {
        id: user._id,
        role: user.role,
      },
      res,
    );

    return res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in googleLogin:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // always return same message (security)
    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetExpire = Date.now() + 1000 * 60 * 15;

    await user.save();
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      email,
      "Reset Password",
      `<h2>Reset Password</h2>
       <p>Click below link:</p>
       <a href="${resetLink}">${resetLink}</a>`,
    );

    res.json({ message: "If email exists, reset link sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetExpire = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { firstName, lastName, phoneNumber, address } = req.body;

    let imageUrl;

    // 🟢 1. Upload image if exists
    if (req.file) {
      imageUrl = await uploadProfileImage(req.file);
    }

    // 🟢 2. Build update object
    // 🟢 2. Build update object (SAFE VERSION)
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;

    if (imageUrl) {
      updateData.profilePic = imageUrl;
    }

    if (imageUrl) {
      updateData.profilePic = imageUrl;
    }

    // 🟢 3. Update DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    // 🟢 4. Return updated user
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Profile update failed",
    });
  }
};
