// Resume Analysis Types
export interface ResumeAnalysisRequest {
    resume_text: string;
    target_job?: string;
}

export interface BestFitJob {
    role: string;
    confidence: number; // 0-100
    description?: string;
}

export interface ResumeAnalysisResponse {
    job_role: string;
    suitability: 'Strong Fit' | 'Partial Fit' | 'Weak Fit';
    score: number; // 1-10
    strengths: string[];
    missing_skills: string[];
    potential_problems: string[];
    improvements: string[];
    encouragement: string;
    // Legacy fields for backwards compatibility
    job_detected?: string;
    suitability_score?: number;
    weaknesses?: string[];
    resume_fixes?: string[];
    overall_feedback?: string;
    best_fit_jobs?: BestFitJob[];
}

// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// File Upload
export interface UploadResponse {
    resume_id: string;
    extracted_text: string;
    file_name: string;
    analysis: ResumeAnalysisResponse;
}

// UI State Types
export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
