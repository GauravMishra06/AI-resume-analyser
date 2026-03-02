import type {
    ResumeAnalysisResponse,
    UploadResponse,
    ApiResponse,
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
