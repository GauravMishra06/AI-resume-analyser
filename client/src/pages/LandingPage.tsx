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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-32 max-w-4xl mx-auto space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-glow-sm"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse ring-4 ring-primary-500/20" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                            Next-Gen Resume Intelligence
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.02] text-white text-balance drop-shadow-2xl">
                        Your career, <br className="hidden md:block" />
                        <span className="gradient-blue pb-2 block">elevated</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium text-balance opacity-80">
                        Harness the power of enterprise-grade AI to score, 
                        optimize, and transform your resume in seconds.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            to="/upload"
                            className="btn btn-primary btn-lg group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Analyse Resume
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            Learn More
                        </a>
                    </motion.div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    id="features"
                    className="w-full mb-40"
                >
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            The Path to Your Dream Job
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Three simple steps to unlock your professional potential with our advanced analysis engine.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                step: '01',
                                icon: FileText,
                                title: 'Precision Upload',
                                desc: 'Seamlessly drop your resume. Our engine supports PDF, DOCX, and high-res images.',
                                color: 'primary'
                            },
                            {
                                step: '02',
                                icon: Sparkles,
                                title: 'Neural Analysis',
                                desc: 'Our AI cross-references your profile against 50,000+ industry-specific benchmarks.',
                                color: 'accent-violet'
                            },
                            {
                                step: '03',
                                icon: BarChart3,
                                title: 'Strategic Insights',
                                desc: 'Receive actionable, weight-based feedback to skyrocket your interview callbacks.',
                                color: 'accent-blue'
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                className="glass-card p-10 group relative"
                            >
                                <span className="text-7xl font-black text-white/[0.03] absolute top-6 right-8 group-hover:text-white/[0.06] transition-all duration-700">
                                    {item.step}
                                </span>
                                <div className={`w-14 h-14 mb-8 rounded-2xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon className={`w-7 h-7 text-primary-400`} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-full relative mb-32"
                >
                    <div className="glass-card p-16 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -z-10" />
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                            Ready to outperform <br className="hidden md:block" /> the competition?
                        </h2>
                        <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto font-medium opacity-90">
                            Join over 50,000 professionals who used ResumeAI to land roles at top-tier companies.
                        </p>
                        <Link
                            to="/upload"
                            className="btn btn-primary btn-lg shadow-glow-md"
                        >
                            Get Started Now
                            <ArrowRight className="w-6 h-6" />
                        </Link>
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

export default LandingPage;
