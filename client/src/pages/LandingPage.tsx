import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui';
import {
    ShieldCheck,
    Zap,
    UserCheck,
    FileText,
    ArrowRight,
    Sparkles,
    Target,
    BarChart3,
} from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-surface">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-6xl px-6 py-16 md:py-28 flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                    className="text-center mb-20 max-w-3xl mx-auto space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100/80 border border-white/[0.08] backdrop-blur-md mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            AI-Powered Analysis v2.0
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-white text-balance">
                        Your resume, <br className="hidden md:block" />
                        <span className="gradient-blue">perfected</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light text-balance">
                        Get instant, expert-level feedback powered by AI.
                        <br className="hidden md:block" />
                        Optimize your resume for any role in seconds.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="pt-4"
                    >
                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-400 transition-all duration-200 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                        >
                            Analyse Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                    className="w-full mb-24"
                >
                    <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: FileText,
                                title: 'Upload Your Resume',
                                desc: 'Drag and drop your resume in PDF or DOCX format.',
                            },
                            {
                                step: '02',
                                icon: Sparkles,
                                title: 'AI Analysis',
                                desc: 'Our AI evaluates your resume against industry standards and your target role.',
                            },
                            {
                                step: '03',
                                icon: BarChart3,
                                title: 'Get Insights',
                                desc: 'Receive a detailed score, strengths, weaknesses, and actionable improvements.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                                className="relative bg-surface-100/60 backdrop-blur-md rounded-2xl border border-white/[0.06] p-8 text-center group hover:border-white/[0.12] transition-colors"
                            >
                                <span className="text-5xl font-bold text-white/[0.04] absolute top-4 right-6 group-hover:text-white/[0.08] transition-colors">
                                    {item.step}
                                </span>
                                <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-primary-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-center md:text-left"
                >
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <ShieldCheck className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Private & Secure</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Files are analyzed in memory and never stored long-term.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <Zap className="w-6 h-6 text-accent-violet" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Instant Insights</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Get actionable feedback in seconds, not days.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="p-3 bg-surface-100 rounded-2xl border border-white/[0.06]">
                            <Target className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">ATS Optimized</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ensure your resume passes automated screening tools.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        Ready to improve your resume?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Join thousands of professionals who landed their dream jobs.
                    </p>
                    <Link
                        to="/upload"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-400 transition-all duration-200 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                {/* Footer */}
                <div className="mt-24 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. Crafted with precision.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
