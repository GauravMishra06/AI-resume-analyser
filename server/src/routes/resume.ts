import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { prepareFileForAnalysis } from "../services/fileService";
import { analyzeResume } from "../services/resumeLLMService";
import { AppError, ErrorCode } from "../types/errors";
import { logger } from "../utils/logger";

import { protect, AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

const router = Router();

/**
 * Absolute path to uploads directory
 */
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

/**
 * Ensure upload directory exists
 */
function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Safely delete file
 */
function safeDeleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.debug(`Cleaned up file: ${path.basename(filePath)}`);
    }
  } catch (err) {
    logger.warn(`Failed to cleanup file: ${path.basename(filePath)}`);
  }
}

/**
 * Multer config
 */
const ACCEPTED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIMES.includes(file.mimetype)) {
      cb(
        new AppError(
          ErrorCode.UNSUPPORTED_FILE_TYPE,
          "Unsupported file type",
          `Received: ${file.mimetype}`
        )
      );
    } else {
      cb(null, true);
    }
  },
});

/**
 * Error response helper
 */
function sendErrorResponse(
  res: Response,
  error: unknown,
  defaultMessage = "An unexpected error occurred"
): void {
  if (error instanceof AppError) {
    res.status(400).json({
      success: false,
      error: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  } else {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({
      success: false,
      error: ErrorCode.INTERNAL_ERROR,
      message,
    });
  }
}

//////////////////////////////////////////////////////////////////
// 🔐 PROTECTED UPLOAD + ANALYZE ROUTE
//////////////////////////////////////////////////////////////////

router.post(
  "/upload",
  protect,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    let filePath: string | null = null;

    try {
      if (!req.file) {
        throw new AppError(
          ErrorCode.NO_FILE_UPLOADED,
          "No file uploaded"
        );
      }

      ensureUploadDir();

      const ext = path.extname(req.file.originalname).toLowerCase();
      const resumeId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
      const filename = `${resumeId}${ext}`;
      filePath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      const preparedFile = await prepareFileForAnalysis(
        filePath,
        req.file.originalname
      );

      const analysis = await analyzeResume({
        resume_text: preparedFile.text,
        images: preparedFile.images,
        target_job: req.body?.target_job,
      });

      //////////////////////////////////////////////////////////////
      // ✅ SAVE TO MONGODB UNDER USER
      //////////////////////////////////////////////////////////////
      await User.findByIdAndUpdate(req.user!.id, {
        $push: {
          resumes: {
            fileName: req.file.originalname,
            score: analysis.suitability_score,
            feedback: analysis.overall_feedback,
            uploadedAt: new Date(),
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          resume_id: resumeId,
          file_name: req.file.originalname,
          extracted_text: preparedFile.text,
          analysis,
        },
      });
    } catch (error) {
      logger.error("Upload failed", error);
      return sendErrorResponse(res, error);
    } finally {
      if (filePath) safeDeleteFile(filePath);
    }
  }
);

//////////////////////////////////////////////////////////////////
// 🔐 PROTECTED TEXT ANALYZE ROUTE
//////////////////////////////////////////////////////////////////

router.post(
  "/analyze",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const { resume_text, target_job } = req.body;

      if (!resume_text || resume_text.length < 50) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Resume text too short"
        );
      }

      const analysis = await analyzeResume({
        resume_text,
        target_job,
      });

      //////////////////////////////////////////////////////////////
      // ✅ SAVE TEXT ANALYSIS
      //////////////////////////////////////////////////////////////
      await User.findByIdAndUpdate(req.user!.id, {
        $push: {
          resumes: {
            fileName: "text-analysis",
            score: analysis.suitability_score,
            feedback: analysis.overall_feedback,
            uploadedAt: new Date(),
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      logger.error("Text analysis failed", error);
      return sendErrorResponse(res, error);
    }
  }
);

//////////////////////////////////////////////////////////////////
// 🔐 FETCH USER RESUME HISTORY
//////////////////////////////////////////////////////////////////

router.get(
  "/my-resumes",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.user!.id).select("resumes");

      return res.status(200).json({
        success: true,
        resumes: user?.resumes || [],
      });
    } catch (error) {
      logger.error("Failed to fetch resumes", error);
      return sendErrorResponse(res, error);
    }
  }
);

export default router;