import User from "../models/user.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jasonwebtoken";

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  if (!user) {
    res.status(400);
    throw new Error("Failed to create user");
  }

  // Return response **without token**
  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // 2️⃣ Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 3️⃣ Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 4️⃣ Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // token expires in 7 days
  );

  // 5️⃣ Send response
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

export { loginUser, createUser };
