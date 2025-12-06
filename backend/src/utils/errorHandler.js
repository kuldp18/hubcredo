/**
 * Standardized error response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (optional)
 */
export const sendError = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
  };

  // Only include details in development mode for security
  if (details && process.env.NODE_ENV === "development") {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standardized success response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data (optional)
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Handle database errors
 * @param {Object} error - Error object
 * @returns {Object} Formatted error object with message
 */
export const handleDbError = (error) => {
  // Duplicate key error (e.g., email already exists)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      message: `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`,
      statusCode: 409,
    };
  }

  // Validation error
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return {
      message: messages[0] || "Validation failed",
      statusCode: 400,
    };
  }

  // Default error
  return {
    message: "An error occurred. Please try again",
    statusCode: 500,
  };
};
