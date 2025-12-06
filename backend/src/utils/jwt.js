import jwt from "jsonwebtoken";

/**
 * Generate JWT access token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn =
    process.env.NODE_ENV === "production"
      ? process.env.JWT_ACCESS_EXPIRE_PROD
      : process.env.JWT_ACCESS_EXPIRE_DEV;

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRE;

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify JWT refresh token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
