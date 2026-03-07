import React, { useEffect } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    AlertTriangle,
    Wrench,
    Target,
    ArrowLeft,
    Lightbulb,
    AlertCircle,
    Sparkles,
    Download,
    Share2,
    Briefcase
} from 'lucide-react';
import { ScoreRing, Button, Badge, AnimatedBackground } from '../components/ui';
import type { ResumeAnalysisResponse } from '../types';

interface LocationState {
    analysis: ResumeAnalysisResponse;
    resumeText: string;
    fileName: string;
    targetJob?: string;
}

// Map score to suitability text and color
function getSuitability(score: number): { text: string; variant: 'success' | 'warning' | 'error'; color: string } {
    if (score >= 7) return { text: 'Strong Match', variant: 'success', color: 'text-success' };
    if (score >= 4) return { text: 'Potential Match', variant: 'warning', color: 'text-warning' };
    return { text: 'Weak Match', variant: 'error', color: 'text-error' };
}

const InsightsPage: React.FC = () => {
    const location = useLocation();
    const state = location.state as LocationState | null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Redirect if no analysis data
    if (!state?.analysis) {
        return <Navigate to="/upload" replace />;
    }

    const { analysis, fileName, targetJob } = state;

    // Handle both new and legacy response formats
    const score = analysis.score ?? analysis.suitability_score ?? 0;
    const jobRole = analysis.job_role ?? analysis.job_detected ?? 'General Professional';
    const strengths = analysis.strengths ?? [];
    const missingSkills = analysis.missing_skills ?? [];
    const potentialProblems = analysis.potential_problems ?? analysis.weaknesses ?? [];
    const improvements = analysis.improvements ?? analysis.resume_fixes ?? [];
    const encouragement = analysis.encouragement ?? analysis.overall_feedback ?? '';
    const suitability = getSuitability(score);

    // Stagger animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                ease: [0.16, 1, 0.3, 1] as any,
                duration: 0.6
            }
        }
    };

    return (
        <div className="min-h-screen bg-surface pb-24 selection:bg-primary-500/20">
            <AnimatedBackground variant="subtle" />

            {/* Header Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
                className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06] relative"
            >
                <div className="container py-4 md:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/upload"
                            className="w-10 h-10 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                            title="Back to Upload"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white leading-tight">Analysis Results</h1>
                            <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{fileName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button variant="secondary" size="sm" className="hidden md:flex">
                            <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Link to="/upload">
                            <Button variant="primary" size="sm">
                                New Scan
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            <main className="container py-10 relative z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    {/* Score Card - Hero - Spans full width on mobile, 4 cols on desktop */}
                    <motion.div variants={item} className="md:col-span-5 lg:col-span-4 h-full">
                        <div className="card-premium p-8 h-full flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-violet" />
                            <div className="absolute top-[-50%] inset-x-0 h-[300px] bg-gradient-to-b from-primary-500/[0.08] to-transparent rounded-full blur-3xl -z-10 group-hover:from-primary-500/[0.12] transition-colors duration-500" />

                            <h2 className="text-gray-400 font-medium text-sm tracking-widest uppercase mb-8">Overall Match Score</h2>

                            <div className="relative mb-8 scale-110">
                                <ScoreRing score={score} maxValue={10} size="xl" />
                            </div>

                            <div className="space-y-2 mb-8">
                                <h3 className={`text-2xl font-bold ${suitability.color}`}>
                                    {suitability.text}
                                </h3>
                                <div className="flex items-center justify-center gap-2 text-gray-300 bg-surface-200 px-4 py-2 rounded-full mx-auto w-fit border border-white/[0.06]">
                                    <Target className="w-4 h-4 text-primary-400" />
                                    <span className="text-sm font-medium">Target: {targetJob || jobRole}</span>
                                </div>
                            </div>

                            <div className="mt-auto w-full pt-6 border-t border-white/[0.06]">
                                <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    <div>Content</div>
                                    <div>Format</div>
                                    <div>Keywords</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center font-semibold text-gray-200 mt-1">
                                    <div>{(score * 0.9).toFixed(1)}</div>
                                    <div>{(score * 1.1 > 10 ? 10 : score * 1.1).toFixed(1)}</div>
                                    <div>{(score).toFixed(1)}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Summary & Stats - Spans 8 cols */}
                    <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                        {/* Executive Summary */}
                        <motion.div variants={item} className="card p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Sparkles className="w-32 h-32 text-primary-400" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-5 h-5 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Career Profile Analysis</h3>
                            </div>
                            <div className="max-h-48 overflow-y-auto scrollbar-thin pr-1">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {encouragement || `Your profile shows promise for the ${jobRole} role. With a score of ${score}/10, you're on the right track, but there are specific areas where you can improve to stand out to recruiters and ATS systems.`}
                                </p>
                            </div>
                        </motion.div>

                        {/* Strengths & Missing Skills Grid */}
                        <div className="grid md:grid-cols-2 gap-6 h-full">
                            {/* Strengths */}
                            <motion.div variants={item} className="card p-6 h-full border-t-4 border-t-success">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-success" />
                                    </div>
                                    <h3 className="font-semibold text-white">Key Strengths</h3>
                                </div>
                                {strengths.length > 0 ? (
                                    <ul className="space-y-3">
                                        {strengths.slice(0, 5).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0 opacity-60" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No specific strengths detected.</p>
                                )}
                            </motion.div>

                            {/* Missing Skills */}
                            <motion.div variants={item} className="card p-6 h-full border-t-4 border-t-primary-500">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                                        <Wrench className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <h3 className="font-semibold text-white">Missing Skills</h3>
                                </div>
                                {missingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {missingSkills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex px-3 py-1.5 rounded-lg bg-surface-200 text-gray-300 text-sm font-medium border border-white/[0.06]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No critical skills missing.</p>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Improvements - Full Width */}
                    <div className="col-span-1 md:col-span-12">
                        <motion.div variants={item} className="grid md:grid-cols-3 gap-6">
                            {/* Improvements List */}
                            <div className="md:col-span-2 card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">Recommended Improvements</h3>
                                        <p className="text-sm text-gray-500">Actionable steps to increase your score</p>
                                    </div>
                                </div>
                                {improvements.length > 0 ? (
                                    <div className="space-y-4">
                                        {improvements.map((fix, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface-200/60 border border-white/[0.06] transition-colors hover:bg-surface-200">
                                                <span className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-sm font-bold text-gray-400 shadow-sm border border-white/[0.06] flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <p className="text-gray-300 text-sm leading-relaxed pt-1.5">
                                                    {fix}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No major improvements found.</p>
                                )}
                            </div>

                            {/* Potential Problems */}
                            <div className="md:col-span-1 card p-8 bg-error/[0.05] border-error/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-error" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Critical Issues</h3>
                                </div>
                                {potentialProblems.length > 0 ? (
                                    <ul className="space-y-4">
                                        {potentialProblems.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-300">
                                                <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-10">
                                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3 opacity-20" />
                                        <p className="text-gray-500 font-medium">No critical issues found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>


                </motion.div>
            </main>
        </div>
    );
};

export default InsightsPage;
