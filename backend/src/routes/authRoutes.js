import express from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (requires authentication)
 * @access  Protected
 */
router.post("/logout", protect, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh", refreshAccessToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
router.get("/me", protect, getCurrentUser);

export default router;
