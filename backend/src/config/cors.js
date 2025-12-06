/**
 * Get allowed CORS origins based on environment
 */
const getAllowedOrigins = () => {
  const origins =
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN_PROD
      : process.env.CORS_ORIGIN_DEV;

  return origins ? origins.split(",").map((o) => o.trim()) : [];
};

/**
 * CORS configuration options
 */
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow if origin is in the list or wildcard is present
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
