import fs from "fs";
import path from "path";
import { pdfToPng, PngPageOutput } from "pdf-to-png-converter";
import mammoth from "mammoth";
import { AppError, ErrorCode } from "../types/errors";
import { logger } from "../utils/logger";

/**
 * Prepared file data for AI analysis
 */
export interface PreparedFile {
    originalName: string;
    extension: string;
    mimeType: string;
    isImage: boolean;
    isDocx: boolean;
    // For images/PDFs: base64 encoded image data
    images?: string[];
    // For DOCX: extracted text
    text?: string;
}

/**
 * Supported file extensions
 */
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const PDF_EXTENSIONS = [".pdf"];
const DOCX_EXTENSIONS = [".docx", ".doc"];

/**
 * Check if file extension is an image type
 */
function isImageFile(ext: string): boolean {
    return IMAGE_EXTENSIONS.includes(ext.toLowerCase());
}

/**
 * Check if file extension is a PDF
 */
function isPdfFile(ext: string): boolean {
    return PDF_EXTENSIONS.includes(ext.toLowerCase());
}

/**
 * Check if file extension is a DOCX/DOC
 */
function isDocxFile(ext: string): boolean {
    return DOCX_EXTENSIONS.includes(ext.toLowerCase());
}

/**
 * Get MIME type from extension
 */
function getMimeType(ext: string): string {
    const mimeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
    };
    return mimeMap[ext.toLowerCase()] || "application/octet-stream";
}

/**
 * Convert PDF buffer to base64 PNG images
 */
async function convertPdfToImages(buffer: Buffer): Promise<string[]> {
    try {
        logger.info("Converting PDF to images...");

        // Convert Buffer to ArrayBuffer for pdfToPng
        const arrayBuffer = buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
        );

        const pngPages: PngPageOutput[] = await pdfToPng(arrayBuffer, {
            disableFontFace: true,
            useSystemFonts: true,
            viewportScale: 2.0, // Higher resolution for better AI analysis
            returnPageContent: true, // Required to get buffer content
        });

        const base64Images = pngPages
            .filter((page) => page.content) // Filter out pages without content
            .map((page) => page.content!.toString("base64"));

        if (base64Images.length === 0) {
            throw new Error("No pages could be converted to images");
        }

        logger.info(`Converted PDF to ${base64Images.length} image(s)`);
        return base64Images;
    } catch (err) {
        logger.error("PDF to image conversion failed:", err);
        throw new AppError(
            ErrorCode.FILE_CONVERSION_ERROR,
            "Failed to convert PDF to images",
            err instanceof Error ? err.message : String(err)
        );
    }
}

/**
 * Extract text from DOCX file
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
    try {
        logger.info("Extracting text from DOCX...");

        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        if (!text || text.trim().length === 0) {
            logger.warn("DOCX appears to be empty or contains no extractable text");
            return "[Empty document]";
        }

        logger.info(`Extracted ${text.length} characters from DOCX`);
        return text;
    } catch (err) {
        logger.error("DOCX text extraction failed:", err);
        throw new AppError(
            ErrorCode.FILE_CONVERSION_ERROR,
            "Failed to extract text from DOCX",
            err instanceof Error ? err.message : String(err)
        );
    }
}

/**
 * Prepare uploaded file for AI analysis
 * - Images: Return as base64
 * - PDFs: Convert pages to PNG images, return as base64
 * - DOCX: Extract text
 */
export async function prepareFileForAnalysis(
    filePath: string,
    originalName: string
): Promise<PreparedFile> {
    const ext = path.extname(originalName).toLowerCase();
    const mimeType = getMimeType(ext);

    // Validate file exists
    if (!fs.existsSync(filePath)) {
        throw new AppError(
            ErrorCode.FILE_READ_ERROR,
            "File not found",
            `Path: ${filePath}`
        );
    }

    // Read file buffer
    let buffer: Buffer;
    try {
        buffer = fs.readFileSync(filePath);
    } catch (err) {
        throw new AppError(
            ErrorCode.FILE_READ_ERROR,
            "Failed to read uploaded file",
            err instanceof Error ? err.message : String(err)
        );
    }

    if (buffer.length === 0) {
        throw new AppError(
            ErrorCode.FILE_READ_ERROR,
            "Uploaded file is empty"
        );
    }

    // Process based on file type
    if (isImageFile(ext)) {
        logger.info(`Processing image file: ${originalName}`);
        return {
            originalName,
            extension: ext,
            mimeType,
            isImage: true,
            isDocx: false,
            images: [buffer.toString("base64")],
        };
    }

    if (isPdfFile(ext)) {
        logger.info(`Processing PDF file: ${originalName}`);
        const images = await convertPdfToImages(buffer);
        return {
            originalName,
            extension: ext,
            mimeType,
            isImage: false,
            isDocx: false,
            images,
        };
    }

    if (isDocxFile(ext)) {
        logger.info(`Processing DOCX file: ${originalName}`);
        const text = await extractDocxText(buffer);
        return {
            originalName,
            extension: ext,
            mimeType,
            isImage: false,
            isDocx: true,
            text,
        };
    }

    // Unsupported file type
    throw new AppError(
        ErrorCode.UNSUPPORTED_FILE_TYPE,
        "File type not supported",
        `Received: ${ext}. Supported: PDF, DOCX, JPG, PNG`
    );
}
