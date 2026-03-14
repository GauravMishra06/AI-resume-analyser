import type {
    ResumeAnalysisResponse,
    UploadResponse,
    ApiResponse,
    JDMatchResponse,
    RewriteResponse,
    InterviewReadinessResponse,
    ResumeVersion,
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get auth headers if token exists
 */
function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Upload resume file and get analysis
 */
export async function uploadResume(file: File, targetJob?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (targetJob?.trim()) {
        formData.append('target_job', targetJob.trim());
    }

    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: formData,
    });

    const data: ApiResponse<UploadResponse> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload resume');
    }

    if (!data.data) {
        throw new Error('No upload response data');
    }

    return data.data;
}

/**
 * Analyze resume text (legacy support)
 */
export async function analyzeResumeText(
    resumeText: string,
    targetJob?: string
): Promise<ResumeAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ resume_text: resumeText, target_job: targetJob }),
    });

    const data: ApiResponse<ResumeAnalysisResponse> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze resume');
    }

    if (!data.data) {
        throw new Error('No analysis data returned');
    }

    return data.data;
}

export async function analyzeJobMatch(
    resumeText: string,
    jobDescription: string,
    targetJob?: string
): Promise<JDMatchResponse> {
    const response = await fetch(`${API_BASE_URL}/resume/jd-match`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            target_job: targetJob,
        }),
    });

    const data: ApiResponse<JDMatchResponse> = await response.json();
    if (!response.ok || !data.success || !data.data) {
        throw new Error(data.message || data.error || 'Failed to generate job match map');
    }
    return data.data;
}

export async function generateRewriteStudio(
    resumeText: string,
    targetJob?: string
): Promise<RewriteResponse> {
    const response = await fetch(`${API_BASE_URL}/resume/rewrite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            resume_text: resumeText,
            target_job: targetJob,
        }),
    });

    const data: ApiResponse<RewriteResponse> = await response.json();
    if (!response.ok || !data.success || !data.data) {
        throw new Error(data.message || data.error || 'Failed to generate rewrite suggestions');
    }
    return data.data;
}

export async function generateInterviewReadinessReport(
    resumeText: string,
    targetJob?: string
): Promise<InterviewReadinessResponse> {
    const response = await fetch(`${API_BASE_URL}/resume/interview-readiness`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            resume_text: resumeText,
            target_job: targetJob,
        }),
    });

    const data: ApiResponse<InterviewReadinessResponse> = await response.json();
    if (!response.ok || !data.success || !data.data) {
        throw new Error(data.message || data.error || 'Failed to generate interview readiness report');
    }
    return data.data;
}

export async function getResumeVersions(): Promise<ResumeVersion[]> {
    const response = await fetch(`${API_BASE_URL}/resume/versions`, {
        headers: {
            ...getAuthHeaders(),
        },
    });

    const data: ApiResponse<ResumeVersion[]> = await response.json();
    if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Failed to fetch resume versions');
    }
    return data.data;
}

export async function saveResumeVersion(payload: {
    resume_id: string;
    file_name: string;
    target_job?: string;
    score: number;
    improvements_count?: number;
    missing_skills_count?: number;
    critical_issues_count?: number;
    source?: 'analyze' | 'rewrite';
}): Promise<ResumeVersion> {
    const response = await fetch(`${API_BASE_URL}/resume/versions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
    });

    const data: ApiResponse<ResumeVersion> = await response.json();
    if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Failed to save resume version');
    }
    return data.data;
}
