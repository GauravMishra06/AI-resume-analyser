/**
 * Simple logger utility with timestamp and level prefixes.
 * Can be extended to use winston or other logging libraries.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
}

function formatTimestamp(): string {
    return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const prefix = {
        info: '📘 INFO',
        warn: '⚠️  WARN',
        error: '🔴 ERROR',
        debug: '🔍 DEBUG',
    }[level];

    let output = `[${formatTimestamp()}] ${prefix}: ${message}`;

    if (data !== undefined) {
        if (data instanceof Error) {
            output += `\n${data.stack || data.message}`;
        } else if (typeof data === 'object') {
            output += `\n${JSON.stringify(data, null, 2)}`;
        } else {
            output += ` ${data}`;
        }
    }

    return output;
}

export const logger = {
    info(message: string, data?: unknown): void {
        console.log(formatMessage('info', message, data));
    },

    warn(message: string, data?: unknown): void {
        console.warn(formatMessage('warn', message, data));
    },

    error(message: string, data?: unknown): void {
        console.error(formatMessage('error', message, data));
    },

    debug(message: string, data?: unknown): void {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
            console.log(formatMessage('debug', message, data));
        }
    },

    /**
     * Log LLM-specific information (prompt, model, tokens)
     */
    llm(action: string, details: {
        model?: string;
        promptLength?: number;
        responseLength?: number;
        tokensUsed?: number;
        latencyMs?: number;
        error?: Error;
    }): void {
        const level: LogLevel = details.error ? 'error' : 'info';
        const emoji = details.error ? '🔴' : '🤖';

        let message = `${emoji} LLM ${action}`;

        const parts: string[] = [];
        if (details.model) parts.push(`model=${details.model}`);
        if (details.promptLength) parts.push(`prompt_len=${details.promptLength}`);
        if (details.responseLength) parts.push(`response_len=${details.responseLength}`);
        if (details.tokensUsed) parts.push(`tokens=${details.tokensUsed}`);
        if (details.latencyMs) parts.push(`latency=${details.latencyMs}ms`);

        if (parts.length > 0) {
            message += ` [${parts.join(', ')}]`;
        }

        if (details.error) {
            this.error(message, details.error);
        } else {
            this.info(message);
        }
    },
};
