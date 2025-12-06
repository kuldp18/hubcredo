/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Zod Validation Error
  // Check for err.name or if the structure matches Zod's issue array
  if (err.name === "ZodError" || (err.issues && Array.isArray(err.issues))) {
    const issues = err.issues || err.errors;
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: This origin is not allowed",
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed",
      errors: messages,
    });
  }

  // Check if message is a stringified JSON (common in some Zod edge cases or external libs)
  let message = err.message || "Internal server error";
  try {
    const parsed = JSON.parse(message);
    if (Array.isArray(parsed) && parsed[0]?.code) {
       // It was a Zod error stringified
       return res.status(400).json({
         success: false,
         message: "Validation failed",
         errors: parsed.map((e) => ({
           field: e.path.join("."),
           message: e.message,
         })),
       });
    }
  } catch (e) {
    // Not JSON, continue
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
