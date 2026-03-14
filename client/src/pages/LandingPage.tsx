import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui';
import {
    FileText,
    ArrowRight,
    Sparkles,
    BarChart3,
    ScanSearch,
    BriefcaseBusiness,
    TrendingUp,
    CheckCircle2,
    Bot,
    SearchCheck,
    WandSparkles,
    Target,
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const featureColorMap = {
        primary: 'bg-primary-500/10 border-primary-500/20 text-primary-400',
        violet: 'bg-accent-violet/10 border-accent-violet/20 text-accent-violet',
        blue: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue',
    } as const;

    const quickStats = [
        { label: 'Resumes Scored', value: '120K+' },
        { label: 'Avg ATS Improvement', value: '+34%' },
        { label: 'Interview Callbacks', value: '3.1x' },
    ];

    const latestFeatures = [
        {
            icon: Bot,
            title: 'AI Bullet Rewriter',
            desc: 'Rewrite weak lines into impact-driven statements using action verbs, metrics, and role language.',
            tone: 'text-primary-300 border-primary-500/30 bg-primary-500/10',
        },
        {
            icon: SearchCheck,
            title: 'ATS Keyword Gap Finder',
            desc: 'Detect missing high-signal keywords from target job descriptions before recruiters ever see your resume.',
            tone: 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
        },
        {
            icon: Target,
            title: 'Role Match Targeting',
            desc: 'Get a role-fit score by domain and seniority with section-level advice on what to improve first.',
            tone: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10',
        },
        {
            icon: WandSparkles,
            title: 'Smart Formatting Audit',
            desc: 'Spot readability, hierarchy, and structure issues that reduce scannability for both ATS and hiring managers.',
            tone: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-surface">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-screen-2xl px-6 lg:px-10 py-16 md:py-28 flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full mb-28"
                >
                    <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-8 items-stretch">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="hidden xl:flex flex-col gap-5"
                        >
                            <div className="glass-card p-5 rounded-3xl">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Live ATS Readiness</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-300">
                                        <ScanSearch className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-xl font-bold">89 / 100</p>
                                        <p className="text-gray-400 text-sm">Pre-check score estimate</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-5 rounded-3xl">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Role Match Snapshot</p>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { role: 'Product Analyst', score: '91%' },
                                        { role: 'Frontend Engineer', score: '87%' },
                                        { role: 'Data Associate', score: '83%' },
                                    ].map((row) => (
                                        <div key={row.role} className="flex items-center justify-between text-gray-300">
                                            <span>{row.role}</span>
                                            <span className="text-primary-300 font-semibold">{row.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className="text-center space-y-8 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.8 }}
                                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-glow-sm"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse ring-4 ring-primary-500/20" />
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                    Next-Gen Resume Intelligence
                                </span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.03] text-white text-balance drop-shadow-2xl">
                                Turn your resume into
                                <span className="gradient-blue pb-2 block">an interview magnet</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium text-balance opacity-80">
                                Analyze, optimize, and benchmark your resume with enterprise-grade AI built to help you pass ATS filters and stand out to recruiters.
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5"
                            >
                                <Link
                                    to="/upload"
                                    className="btn btn-primary btn-lg group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Analyze Resume
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>
                                <a href="#features" className="btn btn-secondary btn-lg">
                                    See How It Works
                                </a>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                                {quickStats.map((stat) => (
                                    <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="hidden xl:flex flex-col gap-5"
                        >
                            <div className="glass-card p-5 rounded-3xl">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Top Insight</p>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        Quantified achievement bullets improve recruiter response rate by up to 42% in your target role.
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card p-5 rounded-3xl">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">What You Get</p>
                                <div className="space-y-2.5 text-sm text-gray-300">
                                    {[
                                        'ATS compatibility grading',
                                        'Keyword and role-fit mapping',
                                        'Actionable rewrite suggestions',
                                    ].map((line) => (
                                        <div key={line} className="flex items-center gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-primary-300 shrink-0" />
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="w-full mb-32"
                >
                    <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-5">
                        <div className="flex items-center gap-3 text-white">
                            <BriefcaseBusiness className="w-5 h-5 text-primary-300" />
                            <p className="text-sm md:text-base text-gray-300">
                                Trusted by candidates applying to global teams at high-growth startups and enterprise companies.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            {['Google', 'Amazon', 'Adobe', 'Atlassian', 'Stripe'].map((brand) => (
                                <span key={brand} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    id="features"
                    className="w-full mb-36"
                >
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            The Path to Your Dream Job
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Three simple steps to unlock your professional potential with our advanced analysis engine.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: FileText,
                                title: 'Precision Upload',
                                desc: 'Seamlessly drop your resume. Our engine supports PDF, DOCX, and high-res images.',
                                color: featureColorMap.primary
                            },
                            {
                                step: '02',
                                icon: Sparkles,
                                title: 'Neural Analysis',
                                desc: 'Our AI cross-references your profile against 50,000+ industry-specific benchmarks.',
                                color: featureColorMap.violet
                            },
                            {
                                step: '03',
                                icon: BarChart3,
                                title: 'Strategic Insights',
                                desc: 'Receive actionable, weight-based feedback to skyrocket your interview callbacks.',
                                color: featureColorMap.blue
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                className="glass-card p-8 lg:p-10 rounded-3xl group relative"
                            >
                                <span className="text-7xl font-black text-white/[0.03] absolute top-6 right-8 group-hover:text-white/[0.06] transition-all duration-700">
                                    {item.step}
                                </span>
                                <div className={`w-14 h-14 mb-8 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="mt-14"
                    >
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                            <div>
                                <p className="text-primary-300 text-xs uppercase tracking-[0.2em] mb-2">Learn More</p>
                                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Latest Features</h3>
                            </div>
                            <p className="text-gray-400 max-w-2xl text-sm md:text-base">
                                New capabilities designed to improve quality, boost ATS relevance, and make your resume sharper in fewer edits.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            {latestFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08, duration: 0.6 }}
                                    className="glass-card rounded-2xl p-6 h-full"
                                >
                                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${feature.tone}`}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-white font-semibold text-lg mb-2.5">{feature.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-full relative mb-32"
                >
                    <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
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
