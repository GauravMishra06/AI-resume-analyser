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
        sm: { width: 80, strokeWidth: 5, fontSize: 'text-xl', labelSize: 'text-xs' },
        md: { width: 120, strokeWidth: 8, fontSize: 'text-3xl', labelSize: 'text-sm' },
        lg: { width: 180, strokeWidth: 10, fontSize: 'text-5xl', labelSize: 'text-base' },
        xl: { width: 240, strokeWidth: 12, fontSize: 'text-7xl', labelSize: 'text-lg' },
    };

    const config = sizeConfig[size];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getScoreColor = () => {
        if (percentage >= 80) return '#34C759'; // Apple Green
        if (percentage >= 60) return '#FF9F0A'; // Apple Orange
        return '#FF3B30'; // Apple Red
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

    // Animation variants
    const circleVariants = {
        hidden: { strokeDashoffset: circumference },
        visible: {
            strokeDashoffset,
            transition: {
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1] as any, // Apple ease
                delay: 0.2
            }
        }
    };

    // Fallback if animation is disabled
    const initialOffset = animate ? circumference : strokeDashoffset;

    return (
        <div className={`inline-flex flex-col items-center ${className}`}>
            <div className="relative">
                {/* Glow effect for high scores */}
                {percentage >= 80 && (
                    <div
                        className="absolute inset-0 rounded-full bg-success/20 blur-xl"
                        style={{ transform: 'scale(0.85)' }}
                    />
                )}

                <svg
                    width={config.width}
                    height={config.width}
                    className="transform -rotate-90 relative z-10"
                >
                    {/* Background circle */}
                    <circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke="#3f3f46"
                        strokeWidth={config.strokeWidth}
                        className="opacity-60"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke={getScoreColor()}
                        strokeWidth={config.strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={animate ? "hidden" : "visible"}
                        animate="visible"
                        variants={circleVariants}
                    />
                </svg>

                {/* Score text - centered within the ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <motion.span
                        className={`font-semibold tracking-tight ${config.fontSize} text-white leading-none`}
                        initial={animate ? { opacity: 0, scale: 0.5, y: 5 } : { opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
                    >
                        {displayValue}
                    </motion.span>
                    <motion.span
                        className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        / {maxValue}
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
                        style={{ color: getScoreColor() }}
                    >
                        {getScoreLabel()}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default ScoreRing;
