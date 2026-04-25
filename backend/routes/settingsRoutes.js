import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// 🟢 Public (checkout page needs this)
router.get("/", getSettings);

// 🟡 Admin only
router.put("/", protect, adminOnly, updateSettings);

export default router;
