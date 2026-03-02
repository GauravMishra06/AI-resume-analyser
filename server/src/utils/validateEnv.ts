import { logger } from './logger';

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = ['GROQ_API_KEY', 'GEMINI_API_KEY'];

/**
 * Validate that all required environment variables are present.
 * Fails fast with clear error messages if any are missing.
 */
export function validateEnvironment(): void {
    const missing: string[] = [];

    for (const envVar of REQUIRED_ENV_VARS) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        logger.error('❌ Missing required environment variables:');
        missing.forEach((v) => logger.error(`   - ${v}`));
        logger.error('');
        logger.error('Please create a .env file with the required variables.');
        logger.error('Example:');
        logger.error('   GROQ_API_KEY=your-groq-api-key');
        logger.error('   GEMINI_API_KEY=your-gemini-api-key');
        logger.error('');
        process.exit(1);
    }

    logger.info('✅ Environment validated successfully');
}
