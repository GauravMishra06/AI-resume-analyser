import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCard, AnimatedBackground } from '../components/ui';
import { uploadResume } from '../services/api';
import { ShieldCheck, Zap, UserCheck } from 'lucide-react';
import type { ProcessingState, UploadResponse } from '../types';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [processingState, setProcessingState] = useState<ProcessingState>('idle');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [jobRole, setJobRole] = useState<string>('');

    const handleFileSelect = useCallback(async (file: File) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setProcessingState('uploading');
        setErrorMessage(undefined);

        try {
            setProcessingState('processing');
            const result: UploadResponse = await uploadResume(file, jobRole);

            await new Promise(resolve => setTimeout(resolve, 800));

            setProcessingState('complete');

            setTimeout(() => {
                navigate('/insights', {
                    state: {
                        analysis: result.analysis,
                        resumeText: result.extracted_text,
                        fileName: result.file_name,
                        targetJob: jobRole,
                    },
                });
            }, 1000);
        } catch (error) {
            setProcessingState('error');
            setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
        }
    }, [navigate, jobRole]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-surface">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-5xl px-6 py-12 md:py-24 flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                    className="text-center mb-16 max-w-3xl mx-auto space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100/80 border border-white/[0.08] backdrop-blur-md mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">AI-Powered Analysis v2.0</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-white text-balance">
                        Your resume, <br className="hidden md:block" />
                        <span className="gradient-blue">perfected</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light text-balance">
                        Get instant, expert-level feedback on your resume. <br className="hidden md:block" />
                        Sign in, drag, drop, and improve.
                    </p>
                </motion.div>

                {/* Upload Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                    className="w-full relative z-10"
                >
                    <UploadCard
                        onFileSelect={handleFileSelect}
                        processingState={processingState}
                        errorMessage={errorMessage}
                        jobRole={jobRole}
                        onJobRoleChange={setJobRole}
                    />
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-center md:text-left"
                >
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <ShieldCheck className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Private & Secure</h3>
                            <p className="text-sm text-gray-500 mt-1">Files are analyzed in memory and never stored long-term.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <Zap className="w-6 h-6 text-accent-violet" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Instant Insights</h3>
                            <p className="text-sm text-gray-500 mt-1">Get actionable feedback in seconds, not days.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <UserCheck className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">ATS Optimized</h3>
                            <p className="text-sm text-gray-500 mt-1">Ensure your resume passes automated screening tools.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="mt-24 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. Crafted with precision.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
