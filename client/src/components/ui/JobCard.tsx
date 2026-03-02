import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Badge from './Badge';

interface JobCardProps {
    role: string;
    confidence: number; // 0-100
    description?: string;
    index?: number;
}

export const JobCard: React.FC<JobCardProps> = ({
    role,
    confidence,
    description,
    index = 0,
}) => {
    const getConfidenceVariant = () => {
        if (confidence >= 80) return 'success';
        if (confidence >= 60) return 'warning';
        return 'error';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group relative bg-surface-100 rounded-xl p-5 border border-white/[0.06]
                 hover:border-white/[0.12] hover:shadow-md transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center
                          group-hover:bg-primary-500/20 transition-colors">
                        <Briefcase className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{role}</h3>
                        {description && (
                            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>
                <Badge variant={getConfidenceVariant()} size="sm">
                    {confidence}% match
                </Badge>
            </div>
        </motion.div>
    );
};

export default JobCard;
