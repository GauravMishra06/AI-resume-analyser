import { Request, Response, NextFunction } from 'express';

/**
 * Validation error response
 */
interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate resume analysis request
 */
export function validateResumeAnalysisRequest(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const errors: ValidationError[] = [];

    // Check if body exists
    if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
            success: false,
            error: 'Request body is required',
        });
        return;
    }

    const { resume_text, target_job } = req.body;

    // Validate resume_text
    if (!resume_text) {
        errors.push({
            field: 'resume_text',
            message: 'Resume text is required',
        });
    } else if (typeof resume_text !== 'string') {
        errors.push({
            field: 'resume_text',
            message: 'Resume text must be a string',
        });
    } else if (resume_text.trim().length < 50) {
        errors.push({
            field: 'resume_text',
            message: 'Resume text is too short (minimum 50 characters)',
        });
    } else if (resume_text.length > 50000) {
        errors.push({
            field: 'resume_text',
            message: 'Resume text is too long (maximum 50,000 characters)',
        });
    }

    // Validate target_job (optional but must be string if provided)
    if (target_job !== undefined && target_job !== null && target_job !== '') {
        if (typeof target_job !== 'string') {
            errors.push({
                field: 'target_job',
                message: 'Target job must be a string',
            });
        } else if (target_job.length > 200) {
            errors.push({
                field: 'target_job',
                message: 'Target job is too long (maximum 200 characters)',
            });
        }
    }

    // Return errors if any
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            error: errors[0].message, // Primary error message
            errors, // All validation errors
        });
        return;
    }

    next();
}
