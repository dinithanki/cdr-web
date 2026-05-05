import express from "express";
import {
  createContact,
  getMyContacts,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👤 USER ROUTES (must login)
router.post("/", protect, createContact);
router.get("/my", protect, getMyContacts);

// 🔴 ADMIN ROUTES
router.get("/", protect, adminOnly, getAllContacts);
router.put("/:id", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;
