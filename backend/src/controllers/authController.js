import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/errorHandler.js";
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/authValidation.js";
import { parseDuration } from "../utils/cookieUtils.js";

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export const signup = asyncHandler(async (req, res) => {
  // Validate request body with Zod
  const validatedData = signupSchema.parse(req.body);
  const { name, email, password } = validatedData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 409, "User with this email already exists");
  }

  // Create new user
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  // Set cookies
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDuration(
      isProduction
        ? process.env.JWT_ACCESS_EXPIRE_PROD
        : process.env.JWT_ACCESS_EXPIRE_DEV
    ),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRE),
  });

  // Send response
  return sendSuccess(res, 201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendError(res, 401, "Invalid credentials");
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return sendError(res, 401, "Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Update refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // Set cookies
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDuration(
        isProduction
          ? process.env.JWT_ACCESS_EXPIRE_PROD
          : process.env.JWT_ACCESS_EXPIRE_DEV
      ),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRE),
  });

  // Send response
  return sendSuccess(res, 200, "Login successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Protected
 */
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Remove refresh token from database
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  const isProduction = process.env.NODE_ENV === "production";
  
  // Clear cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return sendSuccess(res, 200, "Logout successful");
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Try to get token from body first (compatibility) or cookie
  const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken;

  if (!incomingRefreshToken) {
      return sendError(res, 400, "Refresh token is required");
  }

  const { refreshToken } = refreshTokenSchema.parse({ refreshToken: incomingRefreshToken });

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    return sendError(
      res,
      401,
      "Invalid or expired refresh token. Please login again"
    );
  }

  // Find user and verify refresh token matches
  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return sendError(res, 401, "Invalid refresh token. Please login again");
  }

  // Generate new access token
  const newAccessToken = generateAccessToken({ userId: user._id });

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDuration(
        isProduction
          ? process.env.JWT_ACCESS_EXPIRE_PROD
          : process.env.JWT_ACCESS_EXPIRE_DEV
      ),
  });

  return sendSuccess(res, 200, "Token refreshed successfully", {
    accessToken: newAccessToken,
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, "User retrieved successfully", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
});
