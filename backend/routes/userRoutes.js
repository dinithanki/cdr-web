import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { checkAuth } from "../controllers/userController.js";
import { googleLogin } from "../controllers/userController.js";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  makeAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.put("/update-profile", protect, upload.single("image"), updateProfile);

router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/:id", protect, adminOnly, updateUser);
router.patch("/make-admin/:id", protect, adminOnly, makeAdmin);
router.get("/check", protect, checkAuth);

export default router;
