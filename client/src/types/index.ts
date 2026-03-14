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
    message?: string;
}

// File Upload
export interface UploadResponse {
    resume_id: string;
    extracted_text: string;
    file_name: string;
    analysis: ResumeAnalysisResponse;
}

export interface JDMatchResponse {
    target_job: string;
    overall_match: number;
    matched_requirements: string[];
    weak_requirements: string[];
    missing_requirements: string[];
    top_actions: string[];
}

export interface RewriteSuggestion {
    id: string;
    section: string;
    original: string;
    rewritten: string;
    rationale: string;
    impact: 'high' | 'medium' | 'low';
}

export interface RewriteResponse {
    target_job: string;
    suggestions: RewriteSuggestion[];
}

export interface InterviewReadinessResponse {
    target_job: string;
    readiness_score: number;
    likely_questions: string[];
    vulnerable_claims: string[];
    preparation_plan: string[];
}

export interface ResumeVersion {
    versionId: string;
    resumeId: string;
    fileName: string;
    targetJob?: string;
    score: number;
    improvementsCount: number;
    missingSkillsCount: number;
    criticalIssuesCount: number;
    source: 'upload' | 'analyze' | 'rewrite';
    createdAt: string;
}

// UI State Types
export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
