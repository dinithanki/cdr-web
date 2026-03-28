import User from "../models/user";
import express from "express";
import { createUser, loginUser } from "../controllers/userController,js";

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", createUser);

// @route   POST /api/users/login
// @desc    Login user and return token
// @access  Public
router.post("/login", loginUser);

export default router;
