import React from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
    score: number;
    maxValue?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showLabel?: boolean;
    className?: string;
    animate?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
    score,
    maxValue = 100,
    size = 'md',
    showLabel = true,
    className = '',
    animate = true,
}) => {
    // Clamp score between 0 and maxValue
    const clampedScore = Math.min(maxValue, Math.max(0, score));
    // Calculate percentage for ring progress and colors (0-100)
    const percentage = (clampedScore / maxValue) * 100;

    const sizeConfig = {
        sm: { width: 84, strokeWidth: 6, fontSize: 'text-xl', centerClass: 'gap-0.5' },
        md: { width: 124, strokeWidth: 8, fontSize: 'text-3xl', centerClass: 'gap-0.5' },
        lg: { width: 184, strokeWidth: 10, fontSize: 'text-5xl', centerClass: 'gap-1' },
        xl: { width: 244, strokeWidth: 12, fontSize: 'text-7xl', centerClass: 'gap-1.5' },
    };

    const config = sizeConfig[size];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getScoreTone = () => {
        if (percentage >= 80) {
            return {
                color: '#60a5fa',
                from: '#22d3ee',
                to: '#60a5fa',
                glow: 'rgba(96, 165, 250, 0.28)'
            };
        }
        if (percentage >= 60) {
            return {
                color: '#8b5cf6',
                from: '#a78bfa',
                to: '#8b5cf6',
                glow: 'rgba(139, 92, 246, 0.26)'
            };
        }
        return {
            color: '#f43f5e',
            from: '#fb7185',
            to: '#f43f5e',
            glow: 'rgba(244, 63, 94, 0.26)'
        };
    };

    const getScoreLabel = () => {
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Fair';
        return 'Needs Work';
    };

    // Format display score: integer if 10 scale or 100 scale
    // If it was a 10 scale with decimals, we might want to show them, but keeping it simple for now
    const displayValue = maxValue <= 10
        ? (Number.isInteger(clampedScore) ? clampedScore : clampedScore.toFixed(1))
        : Math.round(clampedScore);

    const tone = getScoreTone();
    const gradientId = React.useId();

    // Animation variants
    const circleVariants = {
        hidden: { strokeDashoffset: circumference },
        visible: {
            strokeDashoffset,
            transition: {
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
            }
        }
    };

    // Fallback if animation is disabled
    const initialOffset = animate ? circumference : strokeDashoffset;

    return (
        <div className={`inline-flex flex-col items-center ${className}`}>
            <div className="relative">
                <div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{
                        transform: 'scale(0.86)',
                        background: `radial-gradient(circle at center, ${tone.glow} 0%, rgba(0,0,0,0) 70%)`
                    }}
                />

                <div
                    className="absolute inset-[14%] rounded-full border border-white/[0.08] z-[5]"
                    style={{
                        background:
                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.06) 100%)',
                        backdropFilter: 'blur(6px)'
                    }}
                />

                <svg
                    width={config.width}
                    height={config.width}
                    className="transform -rotate-90 relative z-10"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={tone.from} />
                            <stop offset="100%" stopColor={tone.to} />
                        </linearGradient>
                    </defs>

                    {/* Background circle */}
                    <circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke="#2f3441"
                        strokeWidth={config.strokeWidth}
                        className="opacity-85"
                    />

                    {/* Subtle tick ring */}
                    <circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth={Math.max(1, config.strokeWidth * 0.12)}
                        strokeDasharray="2 8"
                        className="opacity-50"
                    />

                    {/* Progress glow underlay */}
                    <motion.circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={config.strokeWidth + 3}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={animate ? "hidden" : "visible"}
                        animate="visible"
                        variants={circleVariants}
                        className="opacity-30"
                        style={{ filter: 'blur(3px)' }}
                    />

                    {/* Progress circle */}
                    <motion.circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={config.strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={animate ? "hidden" : "visible"}
                        animate="visible"
                        variants={circleVariants}
                    />
                </svg>

                {/* Score text - centered within the ring */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 ${config.centerClass}`}>
                    <motion.span
                        className={`font-semibold tracking-tight ${config.fontSize} text-white leading-none`}
                        initial={animate ? { opacity: 0, scale: 0.5, y: 5 } : { opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {displayValue}
                    </motion.span>
                    <motion.span
                        className="text-gray-400 text-xs font-medium uppercase tracking-wider"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        / {maxValue}
                    </motion.span>
                    <motion.span
                        className="text-[10px] text-gray-500 uppercase tracking-[0.2em]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.95 }}
                    >
                        {Math.round(percentage)}% Score
                    </motion.span>
                </div>
            </div>

            {showLabel && (
                <motion.div
                    className="mt-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-surface-200 shadow-sm border border-white/[0.06]`}
                        style={{ color: tone.color }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full mr-2"
                            style={{ backgroundColor: tone.color }}
                        />
                        {getScoreLabel()}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default ScoreRing;
