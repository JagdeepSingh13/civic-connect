import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
} from "../middleware/validation";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, validateProfileUpdate, updateProfile);
router.put(
  "/change-password",
  authenticate,
  validatePasswordChange,
  changePassword
);

export default router;
