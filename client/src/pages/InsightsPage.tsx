import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    Check,
    CheckCircle,
    ClipboardCheck,
    Copy,
    Download,
    Loader2,
    MessageSquareText,
    PenLine,
    Share2,
    Sparkles,
    Target,
    TrendingUp,
    TriangleAlert,
} from 'lucide-react';
import { AnimatedBackground, Badge, Button, ScoreRing } from '../components/ui';
import {
    analyzeJobMatch,
    generateInterviewReadinessReport,
    generateRewriteStudio,
    getResumeVersions,
    saveResumeVersion,
} from '../services/api';
import type {
    InterviewReadinessResponse,
    JDMatchResponse,
    ResumeAnalysisResponse,
    ResumeVersion,
    RewriteResponse,
} from '../types';

interface LocationState {
    analysis: ResumeAnalysisResponse;
    resumeText: string;
    fileName: string;
    targetJob?: string;
    resumeId?: string;
}

type LabTab = 'overview' | 'rewrite' | 'match' | 'interview' | 'timeline';

function getSuitability(score: number): { text: string; variant: 'success' | 'warning' | 'error'; color: string } {
    if (score >= 7) return { text: 'Strong Match', variant: 'success', color: 'text-success' };
    if (score >= 4) return { text: 'Potential Match', variant: 'warning', color: 'text-warning' };
    return { text: 'Weak Match', variant: 'error', color: 'text-error' };
}

const InsightsPage: React.FC = () => {
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [tab, setTab] = useState<LabTab>('overview');
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

    const [jobDescription, setJobDescription] = useState('');
    const [jdMatch, setJdMatch] = useState<JDMatchResponse | null>(null);
    const [jdLoading, setJdLoading] = useState(false);
    const [jdError, setJdError] = useState<string | null>(null);

    const [rewrite, setRewrite] = useState<RewriteResponse | null>(null);
    const [rewriteLoading, setRewriteLoading] = useState(false);
    const [rewriteError, setRewriteError] = useState<string | null>(null);
    const [acceptedRewrites, setAcceptedRewrites] = useState<Record<string, boolean>>({});
    const [savingVersion, setSavingVersion] = useState(false);

    const [interview, setInterview] = useState<InterviewReadinessResponse | null>(null);
    const [interviewLoading, setInterviewLoading] = useState(false);
    const [interviewError, setInterviewError] = useState<string | null>(null);

    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [versionsError, setVersionsError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const run = async () => {
            setVersionsLoading(true);
            setVersionsError(null);
            try {
                const list = await getResumeVersions();
                setVersions(list);
            } catch (error) {
                setVersionsError(error instanceof Error ? error.message : 'Failed to load versions');
            } finally {
                setVersionsLoading(false);
            }
        };
        run();
    }, []);

    if (!state?.analysis) {
        return <Navigate to="/upload" replace />;
    }

    const { analysis, fileName, targetJob, resumeText } = state;

    const baseScore = analysis.score ?? analysis.suitability_score ?? 0;
    const jobRole = analysis.job_role ?? analysis.job_detected ?? 'General Professional';
    const strengths = analysis.strengths ?? [];
    const missingSkills = analysis.missing_skills ?? [];
    const potentialProblems = analysis.potential_problems ?? analysis.weaknesses ?? [];
    const improvements = analysis.improvements ?? analysis.resume_fixes ?? [];
    const encouragement = analysis.encouragement ?? analysis.overall_feedback ?? '';

    const acceptedCount = useMemo(
        () => Object.values(acceptedRewrites).filter(Boolean).length,
        [acceptedRewrites]
    );

    const projectedScore = useMemo(() => {
        const boosted = baseScore + acceptedCount * 0.25;
        return Number(Math.min(10, boosted).toFixed(1));
    }, [acceptedCount, baseScore]);

    const suitability = getSuitability(projectedScore);

    const tabs: { key: LabTab; label: string; icon: React.ReactNode }[] = [
        { key: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
        { key: 'rewrite', label: 'Rewrite Studio', icon: <PenLine className="w-4 h-4" /> },
        { key: 'match', label: 'JD Match Map', icon: <Target className="w-4 h-4" /> },
        { key: 'interview', label: 'Interview Readiness', icon: <MessageSquareText className="w-4 h-4" /> },
        { key: 'timeline', label: 'Version Timeline', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    const buildSummaryText = () => {
        const lines: string[] = [
            'AI RESUME COPILOT LAB REPORT',
            '===================================',
            `File: ${fileName}`,
            `Target Role: ${targetJob || jobRole}`,
            `Score: ${projectedScore}/10 (${suitability.text})`,
            '',
            'KEY STRENGTHS',
            ...strengths.map((item, idx) => `${idx + 1}. ${item}`),
            '',
            'MISSING SKILLS',
            ...missingSkills.map((item) => `- ${item}`),
            '',
            'TOP IMPROVEMENTS',
            ...improvements.map((item, idx) => `${idx + 1}. ${item}`),
            '',
            `Accepted Rewrite Suggestions: ${acceptedCount}`,
        ];

        if (jdMatch) {
            lines.push('', 'JD MATCH MAP', `Overall Match: ${jdMatch.overall_match}%`);
            jdMatch.top_actions.forEach((action, idx) => lines.push(`${idx + 1}. ${action}`));
        }

        if (interview) {
            lines.push('', 'INTERVIEW READINESS', `Readiness Score: ${interview.readiness_score}%`);
            interview.preparation_plan.forEach((step, idx) => lines.push(`${idx + 1}. ${step}`));
        }

        return lines.join('\n');
    };

    const handleDownload = () => {
        const text = buildSummaryText();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `copilot-lab-${fileName.replace(/\.[^.]+$/, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        const text = buildSummaryText();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Resume Copilot Lab - ${fileName}`,
                    text,
                });
                return;
            } catch {
                // Fallback to clipboard.
            }
        }

        try {
            await navigator.clipboard.writeText(text);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 1600);
        } catch {
            alert('Unable to share. Please copy manually.');
        }
    };

    const runJdMatch = async () => {
        setJdError(null);
        setJdLoading(true);
        try {
            const result = await analyzeJobMatch(resumeText, jobDescription, targetJob || jobRole);
            setJdMatch(result);
        } catch (error) {
            setJdError(error instanceof Error ? error.message : 'Failed to run JD match');
        } finally {
            setJdLoading(false);
        }
    };

    const runRewriteStudio = async () => {
        setRewriteError(null);
        setRewriteLoading(true);
        try {
            const result = await generateRewriteStudio(resumeText, targetJob || jobRole);
            setRewrite(result);
            setAcceptedRewrites({});
        } catch (error) {
            setRewriteError(error instanceof Error ? error.message : 'Failed to generate rewrites');
        } finally {
            setRewriteLoading(false);
        }
    };

    const runInterviewReadiness = async () => {
        setInterviewError(null);
        setInterviewLoading(true);
        try {
            const result = await generateInterviewReadinessReport(resumeText, targetJob || jobRole);
            setInterview(result);
        } catch (error) {
            setInterviewError(error instanceof Error ? error.message : 'Failed to generate interview readiness');
        } finally {
            setInterviewLoading(false);
        }
    };

    const saveRewriteAsVersion = async () => {
        if (acceptedCount < 1) {
            return;
        }

        setSavingVersion(true);
        try {
            const payload = {
                resume_id: state.resumeId || `resume-${Date.now()}`,
                file_name: fileName,
                target_job: targetJob || jobRole,
                score: projectedScore,
                improvements_count: Math.max(0, improvements.length - acceptedCount),
                missing_skills_count: missingSkills.length,
                critical_issues_count: potentialProblems.length,
                source: 'rewrite' as const,
            };

            const version = await saveResumeVersion(payload);
            setVersions((prev) => [version, ...prev]);
            setTab('timeline');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to save version');
        } finally {
            setSavingVersion(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface pb-24 selection:bg-primary-500/20">
            <AnimatedBackground variant="subtle" />

            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 bg-surface/85 backdrop-blur-2xl border-b border-white/[0.06]"
            >
                <div className="container-wide py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            to="/upload"
                            className="w-10 h-10 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-white truncate">Resume Copilot Lab</h1>
                            <p className="text-xs text-gray-500 truncate">{fileName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleShare}>
                            {shareStatus === 'copied' ? (
                                <><Check className="w-4 h-4 mr-2 text-success" /> Copied</>
                            ) : (
                                <><Share2 className="w-4 h-4 mr-2" /> Share</>
                            )}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>
            </motion.header>

            <main className="container-wide py-8 relative z-10">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-premium p-7 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent-cyan to-accent-violet" />
                            <div className="mb-6 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-primary-500/15 border border-primary-500/35 text-primary-300 mb-3">
                                    Live Analysis
                                </span>
                                <h2 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                                    Current
                                    <span className="block gradient-blue">Performance</span>
                                </h2>
                            </div>
                            <div className="flex items-center justify-center mb-6">
                                <ScoreRing score={projectedScore} maxValue={10} size="xl" />
                            </div>
                            <div className="text-center space-y-3">
                                <p className={`text-2xl font-semibold ${suitability.color}`}>{suitability.text}</p>
                                <p className="text-gray-400 text-sm">Target: {targetJob || jobRole}</p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                                    <Sparkles className="w-4 h-4 text-primary-400" />
                                    <span>Accepted rewrites: {acceptedCount}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Gaps</p>
                                    <p className="text-lg font-semibold text-white">{missingSkills.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Issues</p>
                                    <p className="text-lg font-semibold text-white">{potentialProblems.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Actions</p>
                                    <p className="text-lg font-semibold text-white">{improvements.length}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card p-5 mt-6"
                        >
                            <p className="text-sm text-gray-500 mb-4">Confidence Indicators</p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Role Detection</span>
                                    <Badge variant="success">High</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Skill Mapping</span>
                                    <Badge variant="warning">Medium</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Interview Projection</span>
                                    <Badge variant="warning">Medium</Badge>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="xl:col-span-9 space-y-6">
                        <div className="card p-3 overflow-x-auto">
                            <div className="flex items-center gap-2 min-w-max">
                                {tabs.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                                            tab === item.key
                                                ? 'bg-primary-500/15 text-primary-300 border-primary-500/40'
                                                : 'bg-surface-200 text-gray-400 border-white/[0.06] hover:text-white'
                                        }`}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            {item.icon}
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {tab === 'overview' && (
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="card p-7">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Executive Summary</h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">
                                        {encouragement || `Your profile fits the ${jobRole} trajectory with targeted improvements.`}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="card p-6 border-t-4 border-t-success">
                                        <h4 className="text-white font-semibold mb-4">Strengths</h4>
                                        {strengths.length > 0 ? (
                                            <ul className="space-y-3 text-sm text-gray-300">
                                                {strengths.map((item, idx) => (
                                                    <li key={idx} className="flex gap-2">
                                                        <CheckCircle className="w-4 h-4 mt-0.5 text-success" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No strengths returned.</p>
                                        )}
                                    </div>

                                    <div className="card p-6 border-t-4 border-t-warning">
                                        <h4 className="text-white font-semibold mb-4">Critical Issues</h4>
                                        {potentialProblems.length > 0 ? (
                                            <ul className="space-y-3 text-sm text-gray-300">
                                                {potentialProblems.map((item, idx) => (
                                                    <li key={idx} className="flex gap-2">
                                                        <TriangleAlert className="w-4 h-4 mt-0.5 text-warning" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No critical issues found.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {tab === 'rewrite' && (
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="card p-7">
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Interactive Rewrite Studio</h3>
                                            <p className="text-gray-400 text-sm mt-1">Generate section-level rewrite suggestions and accept the ones you want.</p>
                                        </div>
                                        <Button onClick={runRewriteStudio} isLoading={rewriteLoading} disabled={!resumeText}>
                                            {rewrite ? 'Regenerate' : 'Generate Suggestions'}
                                        </Button>
                                    </div>

                                    {!resumeText && (
                                        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning mb-4">
                                            Resume text could not be extracted from this file. Text-based features require a DOCX or text-extractable PDF.
                                        </div>
                                    )}


                                    {rewriteError && (
                                        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error mb-4">
                                            {rewriteError}
                                        </div>
                                    )}

                                    {!rewrite && !rewriteLoading && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-6 text-gray-400 text-sm">
                                            No rewrite suggestions yet. Run the studio to generate ATS-focused alternatives.
                                        </div>
                                    )}

                                    {rewriteLoading && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-10 text-center text-gray-400">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Crafting rewrite suggestions...
                                        </div>
                                    )}

                                    {rewrite && rewrite.suggestions.length > 0 && (
                                        <div className="space-y-4">
                                            {rewrite.suggestions.map((item) => {
                                                const accepted = Boolean(acceptedRewrites[item.id]);
                                                return (
                                                    <div key={item.id} className={`rounded-2xl border p-4 ${accepted ? 'border-success/40 bg-success/10' : 'border-white/[0.08] bg-surface-200/50'}`}>
                                                        <div className="flex items-center justify-between gap-3 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={item.impact === 'high' ? 'success' : item.impact === 'medium' ? 'warning' : 'default'}>
                                                                    {item.impact.toUpperCase()} IMPACT
                                                                </Badge>
                                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{item.section}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setAcceptedRewrites((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${accepted ? 'bg-success/15 border-success/40 text-success' : 'bg-surface-300 border-white/[0.08] text-gray-300 hover:text-white'}`}
                                                            >
                                                                {accepted ? 'Accepted' : 'Accept'}
                                                            </button>
                                                        </div>
                                                        <div className="grid md:grid-cols-2 gap-3">
                                                            <div className="rounded-xl bg-surface-300/70 border border-white/[0.06] p-3">
                                                                <p className="text-xs text-gray-500 uppercase mb-2">Before</p>
                                                                <p className="text-sm text-gray-300">{item.original}</p>
                                                            </div>
                                                            <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-3">
                                                                <p className="text-xs text-primary-300 uppercase mb-2">After</p>
                                                                <p className="text-sm text-gray-100">{item.rewritten}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-3">Why this helps: {item.rationale}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <p className="text-sm text-gray-400">Projected score with accepted rewrites: <span className="text-white font-semibold">{projectedScore}/10</span></p>
                                        <Button onClick={saveRewriteAsVersion} isLoading={savingVersion} disabled={acceptedCount < 1}>
                                            Save as New Version
                                        </Button>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {tab === 'match' && (
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="card p-7">
                                    <h3 className="text-xl font-semibold text-white">Job Description Match Map</h3>
                                    <p className="text-gray-400 text-sm mt-1 mb-4">Paste a job description to compare requirement coverage and identify missing signals.</p>

                                    {!resumeText && (
                                        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning mb-4">
                                            Resume text could not be extracted from this file. Text-based features require a DOCX or text-extractable PDF.
                                        </div>
                                    )}

                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        rows={8}
                                        placeholder="Paste job description here..."
                                        className="w-full rounded-2xl bg-surface-200/70 border border-white/[0.08] px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    />

                                    <div className="mt-4">
                                        <Button onClick={runJdMatch} isLoading={jdLoading} disabled={!resumeText || jobDescription.trim().length < 30}>
                                            Analyze Match Map
                                        </Button>
                                    </div>

                                    {jdError && (
                                        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error mt-4">
                                            {jdError}
                                        </div>
                                    )}
                                </div>

                                {jdMatch && (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="card p-5 md:col-span-3 border-t-4 border-t-primary-500">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Overall Match</p>
                                            <p className="text-4xl font-bold text-white mt-1">{jdMatch.overall_match}%</p>
                                        </div>

                                        <div className="card p-5 border-t-4 border-t-success">
                                            <h4 className="text-white font-semibold mb-3">Matched</h4>
                                            <ul className="space-y-2 text-sm text-gray-300">
                                                {jdMatch.matched_requirements.length > 0 ? jdMatch.matched_requirements.map((item, idx) => (
                                                    <li key={idx} className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-success" />{item}</li>
                                                )) : <li className="text-gray-500">No strong matches yet.</li>}
                                            </ul>
                                        </div>

                                        <div className="card p-5 border-t-4 border-t-warning">
                                            <h4 className="text-white font-semibold mb-3">Weak Signals</h4>
                                            <ul className="space-y-2 text-sm text-gray-300">
                                                {jdMatch.weak_requirements.length > 0 ? jdMatch.weak_requirements.map((item, idx) => (
                                                    <li key={idx} className="flex gap-2"><ClipboardCheck className="w-4 h-4 mt-0.5 text-warning" />{item}</li>
                                                )) : <li className="text-gray-500">No weak requirements detected.</li>}
                                            </ul>
                                        </div>

                                        <div className="card p-5 border-t-4 border-t-error">
                                            <h4 className="text-white font-semibold mb-3">Missing</h4>
                                            <ul className="space-y-2 text-sm text-gray-300">
                                                {jdMatch.missing_requirements.length > 0 ? jdMatch.missing_requirements.map((item, idx) => (
                                                    <li key={idx} className="flex gap-2"><TriangleAlert className="w-4 h-4 mt-0.5 text-error" />{item}</li>
                                                )) : <li className="text-gray-500">No critical missing requirements.</li>}
                                            </ul>
                                        </div>

                                        <div className="card p-5 md:col-span-3">
                                            <h4 className="text-white font-semibold mb-3">Top 5 Actions</h4>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {jdMatch.top_actions.map((item, idx) => (
                                                    <div key={idx} className="rounded-xl border border-white/[0.06] bg-surface-200/50 p-3 text-sm text-gray-300">
                                                        <span className="text-primary-400 font-semibold mr-2">{idx + 1}.</span>{item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {tab === 'interview' && (
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="card p-7">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Interview Readiness Mode</h3>
                                            <p className="text-gray-400 text-sm mt-1">Generate likely interview questions and challenge-risk areas based on this resume.</p>
                                        </div>
                                        <Button onClick={runInterviewReadiness} isLoading={interviewLoading} disabled={!resumeText}>
                                            {interview ? 'Refresh' : 'Generate'}
                                        </Button>
                                    </div>

                                    {!resumeText && (
                                        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning mb-4">
                                            Resume text could not be extracted from this file. Text-based features require a DOCX or text-extractable PDF.
                                        </div>
                                    )}


                                    {interviewError && (
                                        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error mb-4">
                                            {interviewError}
                                        </div>
                                    )}

                                    {!interview && !interviewLoading && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-6 text-gray-400 text-sm">
                                            No interview data yet. Generate a readiness report to unlock this panel.
                                        </div>
                                    )}

                                    {interviewLoading && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-10 text-center text-gray-400">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Building your interview readiness profile...
                                        </div>
                                    )}

                                    {interview && (
                                        <div className="space-y-5">
                                            <div className="rounded-2xl border border-primary-500/30 bg-primary-500/10 px-5 py-4">
                                                <p className="text-xs text-primary-300 uppercase tracking-widest">Readiness Score</p>
                                                <p className="text-3xl font-bold text-white mt-1">{interview.readiness_score}%</p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 p-4">
                                                    <h4 className="text-white font-semibold mb-3">Likely Questions</h4>
                                                    <ul className="space-y-2 text-sm text-gray-300">
                                                        {interview.likely_questions.map((item, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <span className="text-primary-400">Q{idx + 1}</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 p-4">
                                                    <h4 className="text-white font-semibold mb-3">Vulnerable Claims</h4>
                                                    <ul className="space-y-2 text-sm text-gray-300">
                                                        {interview.vulnerable_claims.length > 0 ? interview.vulnerable_claims.map((item, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <TriangleAlert className="w-4 h-4 mt-0.5 text-warning" />
                                                                <span>{item}</span>
                                                            </li>
                                                        )) : <li className="text-gray-500">No major vulnerable claims detected.</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 p-4">
                                                <h4 className="text-white font-semibold mb-3">Preparation Plan</h4>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    {interview.preparation_plan.map((item, idx) => (
                                                        <div key={idx} className="rounded-xl border border-white/[0.06] bg-surface-300/50 px-3 py-2 text-sm text-gray-300">
                                                            <span className="text-accent-cyan font-semibold mr-2">{idx + 1}.</span>{item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}

                        {tab === 'timeline' && (
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="card p-7">
                                    <h3 className="text-xl font-semibold text-white mb-1">Version Timeline</h3>
                                    <p className="text-gray-400 text-sm mb-5">Track how your resume quality evolves across uploads, analysis, and rewrites.</p>

                                    {versionsError && (
                                        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error mb-4">
                                            {versionsError}
                                        </div>
                                    )}

                                    {versionsLoading && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-10 text-center text-gray-400">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading timeline...
                                        </div>
                                    )}

                                    {!versionsLoading && versions.length === 0 && (
                                        <div className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-5 py-6 text-gray-400 text-sm">
                                            No versions found yet. Save your first rewrite version to start tracking improvement.
                                        </div>
                                    )}

                                    {!versionsLoading && versions.length > 0 && (
                                        <div className="space-y-3">
                                            {versions.slice(0, 20).map((item) => (
                                                <div key={item.versionId} className="rounded-2xl border border-white/[0.08] bg-surface-200/50 px-4 py-3 flex items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-white font-medium truncate">{item.fileName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(item.createdAt).toLocaleString()} • {item.source.toUpperCase()} • {item.targetJob || jobRole}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary-300">{Number(item.score).toFixed(1)}</p>
                                                        <p className="text-xs text-gray-500">Score</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-surface/95 backdrop-blur-xl border-t border-white/[0.08] p-3 z-50">
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setTab('rewrite')}
                        className="rounded-xl bg-surface-200 border border-white/[0.08] px-3 py-2 text-xs text-gray-300"
                    >
                        Rewrite
                    </button>
                    <button
                        onClick={() => setTab('match')}
                        className="rounded-xl bg-surface-200 border border-white/[0.08] px-3 py-2 text-xs text-gray-300"
                    >
                        Match
                    </button>
                    <button
                        onClick={() => setTab('timeline')}
                        className="rounded-xl bg-primary-500/20 border border-primary-500/40 px-3 py-2 text-xs text-primary-300"
                    >
                        Timeline
                    </button>
                </div>
            </div>

            <button
                onClick={handleShare}
                className="fixed right-6 bottom-20 md:bottom-8 z-40 w-12 h-12 rounded-full bg-primary-500 text-white shadow-glow-md flex items-center justify-center hover:bg-primary-400 transition-colors"
                title="Quick Share"
            >
                {shareStatus === 'copied' ? <Copy className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default InsightsPage;
