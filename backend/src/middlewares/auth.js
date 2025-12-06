import { verifyAccessToken } from "../utils/jwt.js";
import { sendError } from "../utils/errorHandler.js";
import User from "../models/User.js";

/**
 * Middleware to protect routes - verifies JWT access token
 * Usage: Add this middleware to routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 401, "Access denied. No token provided");
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return sendError(
        res,
        401,
        "Invalid or expired token. Please login again"
      );
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );
    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return sendError(res, 500, "Authentication failed");
  }
};
