import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { AppError, ErrorCode } from '../types/errors';

// Types
export interface ResumeAnalysisRequest {
    resume_text?: string;
    images?: string[]; // Base64 encoded images
    target_job?: string;
}

export interface ResumeAnalysisResponse {
    // New schema fields
    job_role: string;
    suitability: 'Strong Fit' | 'Partial Fit' | 'Weak Fit';
    score: number; // 1-10
    strengths: string[];
    missing_skills: string[];
    potential_problems: string[];
    improvements: string[];
    encouragement: string;
    // Legacy fields for backwards compatibility
    job_detected: string;
    suitability_score: number;
    weaknesses: string[];
    resume_fixes: string[];
    overall_feedback: string;
    confidence_score: number;
    warnings: string[];
}

// Lazy initialization of Gemini client (created after dotenv loads)
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
    if (!geminiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new AppError(
                ErrorCode.VALIDATION_ERROR,
                'GEMINI_API_KEY is not configured',
                'Please set GEMINI_API_KEY in environment variables'
            );
        }
        geminiClient = new GoogleGenerativeAI(apiKey);
    }
    return geminiClient;
}

// Model configuration - using stable models
const TEXT_MODEL = 'gemini-2.5-flash-lite';
const VISION_MODEL = 'gemini-2.5-flash-lite';

// Generation config matching Groq behavior
const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 2500,
    topP: 0.95,
    topK: 40,
};

// Safety settings - permissive to avoid blocking resume content
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

/**
 * System prompt for resume analysis - deterministic, JSON-only output
 */
const SYSTEM_PROMPT = `You are an expert AI resume analyst specializing in job-role-specific resume evaluation.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no commentary, no extra text
2. Be deterministic and objective
3. Provide actionable, specific feedback
4. Analyze against the target job role when provided
5. Score fairly using the FULL 1-10 range. Avoid clustering around 5-7.
6. Do NOT default to the same score. Differentiate between resumes.
7. If the document is NOT a resume, set score to 1 and explain in potential_problems.

ANALYSIS REQUIREMENTS:
- Identify skill gaps specific to the target role
- Detect missing or weak experience
- Assess resume structure and ATS compatibility
- Flag role-specific risks (e.g. "backend role but no databases mentioned")
- Provide realistic, actionable encouragement

ENCOURAGEMENT GUIDELINES:
- Focus on skills that can be learned quickly (1-3 months)
- Suggest specific projects the candidate can build
- Recommend relevant certifications or tools
- Be realistic and specific, NOT generic motivational fluff

OUTPUT SCHEMA (return exactly this JSON structure):
{
  "job_role": "string - the target role being analyzed for (use provided target or detect from resume)",
  "suitability": "Strong Fit" | "Partial Fit" | "Weak Fit",
  "score": number (1-10, use decimals for precision like 6.5 or 7.2),
  "strengths": ["array of 3-5 specific strengths relevant to the role"],
  "missing_skills": ["array of specific skills missing for this role"],
  "potential_problems": ["array of issues: skill gaps, weak experience, resume problems, ATS issues, role-specific risks"],
  "improvements": ["array of 3-5 specific, actionable improvements to make"],
  "encouragement": "A paragraph of realistic, actionable encouragement focusing on quick wins, projects to build, and skills to learn"
}`;

/**
 * Vision prompt for analyzing resume images
 */
const VISION_PROMPT = `You are an expert resume analyzer.
A resume file is attached as image(s).

Read and understand the entire document regardless of format, layout, or quality.
The document may be a scanned PDF, image-based resume, or text-based file.

If the document is scanned or partially unreadable:
- Extract as much information as possible
- Make reasonable assumptions where needed
- Note uncertainty in potential_problems

Analyze the resume and return ONLY valid JSON with the structure specified in the system message.`;

/**
 * Build the user prompt for text-based resume analysis
 */
function buildTextPrompt(resumeText: string, targetJob?: string): string {
    let prompt = '';

    if (targetJob?.trim()) {
        prompt += `TARGET JOB ROLE: ${targetJob.trim()}\n\n`;
        prompt += `Analyze this resume specifically for the "${targetJob.trim()}" role.\n\n`;
    } else {
        prompt += `TARGET JOB ROLE: Detect from resume content (general job market analysis)\n\n`;
    }

    prompt += `RESUME CONTENT:\n${resumeText}\n\n`;
    prompt += `Analyze this resume and return ONLY the JSON response as specified. Be specific and actionable.`;

    return prompt;
}

/**
 * Parse and validate the LLM response
 */
function parseResponse(content: string, targetJob?: string): ResumeAnalysisResponse {
    // Try to extract JSON from the response
    let jsonStr = content.trim();

    // Handle potential markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
    }

    // Find JSON object boundaries
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');

    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error('No valid JSON object found in response');
    }

    jsonStr = jsonStr.substring(startIdx, endIdx + 1);

    const parsed = JSON.parse(jsonStr);

    // Validate and extract score (1-10)
    let score = Number(parsed.score);
    if (isNaN(score) || score < 1 || score > 10) {
        // Try to recover from normalized score if present
        if (parsed.normalized_score !== undefined) {
            const normalizedScore = Number(parsed.normalized_score);
            if (!isNaN(normalizedScore) && normalizedScore >= -1 && normalizedScore <= 1) {
                score = ((normalizedScore + 1) / 2) * 9 + 1; // Map -1..1 to 1..10
            }
        }
        if (isNaN(score) || score < 1 || score > 10) {
            score = 5; // Default to middle score if invalid
            logger.warn('Invalid score in LLM response, defaulting to 5');
        }
    }

    // Validate suitability
    let suitability: 'Strong Fit' | 'Partial Fit' | 'Weak Fit' = 'Partial Fit';
    if (parsed.suitability === 'Strong Fit' || parsed.suitability === 'Partial Fit' || parsed.suitability === 'Weak Fit') {
        suitability = parsed.suitability;
    } else {
        // Derive from score
        if (score >= 7) suitability = 'Strong Fit';
        else if (score >= 4) suitability = 'Partial Fit';
        else suitability = 'Weak Fit';
    }

    // Extract job role
    const jobRole = parsed.job_role || parsed.job_detected || targetJob || 'Unknown';

    // Build response with both new and legacy fields
    const response: ResumeAnalysisResponse = {
        // New schema
        job_role: jobRole,
        suitability,
        score: Math.round(score * 10) / 10, // Round to 1 decimal
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        missing_skills: Array.isArray(parsed.missing_skills) ? parsed.missing_skills : [],
        potential_problems: Array.isArray(parsed.potential_problems) ? parsed.potential_problems : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        encouragement: parsed.encouragement || '',
        // Legacy fields for backwards compatibility
        job_detected: jobRole,
        suitability_score: score,
        weaknesses: Array.isArray(parsed.potential_problems) ? parsed.potential_problems : (Array.isArray(parsed.weaknesses) ? parsed.weaknesses : []),
        resume_fixes: Array.isArray(parsed.improvements) ? parsed.improvements : (Array.isArray(parsed.resume_fixes) ? parsed.resume_fixes : []),
        overall_feedback: parsed.encouragement || parsed.overall_feedback || '',
        confidence_score: 0.8, // Default confidence
        warnings: [],
    };

    return response;
}

/**
 * Analyze resume using text-based LLM (Gemini)
 */
export async function analyzeResume(request: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> {
    // Route to vision model if images are provided
    if (request.images && request.images.length > 0) {
        return analyzeResumeWithVision(request.images, request.target_job);
    }

    if (!request.resume_text) {
        throw new AppError(
            ErrorCode.VALIDATION_ERROR,
            'No resume content provided',
            'Either resume_text or images must be provided'
        );
    }

    const startTime = Date.now();
    const userPrompt = buildTextPrompt(request.resume_text, request.target_job);

    logger.info('LLM Request', {
        model: TEXT_MODEL,
        promptLength: userPrompt.length,
        targetJob: request.target_job,
    });

    try {
        const model = getGeminiClient().getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig,
            safetySettings,
            systemInstruction: SYSTEM_PROMPT,
        });

        const result = await model.generateContent(userPrompt);
        const response = result.response;
        const content = response.text();

        if (!content) {
            throw new Error('Empty response from LLM');
        }

        const latencyMs = Date.now() - startTime;

        logger.info('LLM Response', {
            model: TEXT_MODEL,
            responseLength: content.length,
            latencyMs,
        });

        const parsedResponse = parseResponse(content, request.target_job);
        return parsedResponse;

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        logger.error('LLM Error', {
            model: TEXT_MODEL,
            latencyMs,
            error: error instanceof Error ? error : new Error(String(error)),
        });

        throw new AppError(
            ErrorCode.AI_ANALYSIS_ERROR,
            'Resume analysis failed',
            error instanceof Error ? error.message : String(error)
        );
    }
}

/**
 * Analyze resume using vision model (for images and PDF pages) - Gemini
 */
export async function analyzeResumeWithVision(
    images: string[],
    targetJob?: string
): Promise<ResumeAnalysisResponse> {
    const startTime = Date.now();

    logger.info('Vision LLM Request', {
        model: VISION_MODEL,
        imageCount: images.length,
        targetJob,
    });

    try {
        const model = getGeminiClient().getGenerativeModel({
            model: VISION_MODEL,
            generationConfig,
            safetySettings,
            systemInstruction: SYSTEM_PROMPT,
        });

        // Build content parts with images
        const imageParts = images.map((base64) => ({
            inlineData: {
                mimeType: 'image/png',
                data: base64,
            },
        }));

        let textPrompt = VISION_PROMPT;
        if (targetJob?.trim()) {
            textPrompt = `TARGET JOB ROLE: ${targetJob.trim()}\n\nAnalyze this resume specifically for the "${targetJob.trim()}" role.\n\n${textPrompt}`;
        }

        // Combine text and images
        const contentParts = [
            { text: textPrompt },
            ...imageParts,
        ];

        const result = await model.generateContent(contentParts);
        const response = result.response;
        const content = response.text();

        if (!content) {
            throw new Error('Empty response from vision LLM');
        }

        const latencyMs = Date.now() - startTime;

        logger.info('Vision LLM Response', {
            model: VISION_MODEL,
            responseLength: content.length,
            latencyMs,
        });

        const parsedResponse = parseResponse(content, targetJob);
        return parsedResponse;

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        logger.error('Vision LLM Error', {
            model: VISION_MODEL,
            latencyMs,
            error: error instanceof Error ? error : new Error(String(error)),
        });

        throw new AppError(
            ErrorCode.AI_ANALYSIS_ERROR,
            'Vision model analysis failed',
            error instanceof Error ? error.message : String(error)
        );
    }
}
