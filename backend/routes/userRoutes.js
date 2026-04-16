import express from "express";
import { signup, login,logout } from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {uploadProfilePic} from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getAllUsers, deleteUser, updateUser,makeAdmin } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/upload-profile-pic", upload.single("image"), uploadProfilePic);
router.post("/logout", logout);

router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/:id", protect, adminOnly, updateUser);
router.patch("/make-admin/:id",protect,adminOnly,makeAdmin);

export default router;