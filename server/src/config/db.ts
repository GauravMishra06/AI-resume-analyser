import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB Connected 🚀");
  } catch (error) {
    logger.error("MongoDB connection failed");
    process.exit(1);
  }
};