import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { getAuthCookieOptions } from "../utils/generateToken.js";

const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded?.id || decoded?.userId;

  return User.findById(userId).select("-password");
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.user = null;
      return next();
    }

    const user = await getUserFromToken(token);
    req.user = user || null;

    if (!user) {
      res.clearCookie("jwt", getAuthCookieOptions());
    }

    return next();
  } catch {
    req.user = null;
    res.clearCookie("jwt", getAuthCookieOptions());
    return next();
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
