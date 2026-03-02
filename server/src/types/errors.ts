/**
 * Structured error types for machine-readable API responses
 */

export enum ErrorCode {
    // Validation errors
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NO_FILE_UPLOADED = 'NO_FILE_UPLOADED',
    UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',

    // File processing errors
    FILE_READ_ERROR = 'FILE_READ_ERROR',
    FILE_CONVERSION_ERROR = 'FILE_CONVERSION_ERROR',

    // LLM errors
    LLM_ERROR = 'LLM_ERROR',
    LLM_RESPONSE_PARSE_ERROR = 'LLM_RESPONSE_PARSE_ERROR',
    AI_ANALYSIS_ERROR = 'AI_ANALYSIS_ERROR',

    // Generic errors
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    INVALID_SCORE = 'INVALID_SCORE',
}

export interface ApiError {
    error: ErrorCode;
    message: string;
    details?: string;
}

/**
 * Custom error class with structured error code
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly details?: string;

    constructor(code: ErrorCode, message: string, details?: string) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }

    toJSON(): ApiError {
        return {
            error: this.code,
            message: this.message,
            ...(this.details && { details: this.details }),
        };
    }
}
