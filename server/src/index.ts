import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { validateEnvironment } from "./utils/validateEnv";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

import resumeRoutes from "./routes/resume";
import authRoutes from "./routes/auth";

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ Validate env variables
validateEnvironment();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: "1mb" }));

// ✅ Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// ✅ Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

// ✅ Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;