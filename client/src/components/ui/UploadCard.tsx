import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';
import type { ProcessingState } from '../../types';

interface UploadCardProps {
    onFileSelect: (file: File) => void;
    processingState: ProcessingState;
    errorMessage?: string;
    jobRole: string;
    onJobRoleChange: (value: string) => void;
}

const ACCEPTED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/webp',
];

const ACCEPTED_EXTENSIONS = '.pdf,.docx,.doc,.jpg,.jpeg,.png,.webp';

export const UploadCard: React.FC<UploadCardProps> = ({
    onFileSelect,
    processingState,
    errorMessage,
    jobRole,
    onJobRoleChange,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (ACCEPTED_TYPES.includes(file.type)) {
                setFileName(file.name);
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFileName(files[0].name);
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    const isProcessing = processingState === 'uploading' || processingState === 'processing';
    const isComplete = processingState === 'complete';
    const isError = processingState === 'error';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[580px] mx-auto space-y-6"
        >
            {/* Job Role Input */}
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors duration-500 z-10">
                    <Briefcase className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => onJobRoleChange(e.target.value)}
                    placeholder="Target Job Role (Optional)"
                    disabled={isProcessing}
                    className={`
                        w-full pl-16 pr-6 py-5 rounded-[2rem]
                        bg-surface-100/40 backdrop-blur-2xl border border-white/[0.08]
                        shadow-2xl shadow-black/40
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/40
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-500 ease-expo
                    `}
                    id="job-role-input"
                />
            </div>

            {/* Upload Area */}
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative flex flex-col items-center justify-center
                    w-full h-96 rounded-[3rem]
                    border-2 border-dashed
                    transition-all duration-700 ease-expo cursor-pointer
                    overflow-hidden group
                    ${isDragging
                        ? 'border-primary-400 bg-primary-500/[0.1] scale-[1.02] shadow-glow-lg'
                        : isError
                            ? 'border-error/40 bg-error/[0.08]'
                            : isComplete
                                ? 'border-success/40 bg-success/[0.08]'
                                : 'border-white/[0.1] bg-surface-100/30 hover:border-primary-500/40 hover:bg-surface-100/40 hover:shadow-glow-md'
                    }
                    ${isProcessing ? 'pointer-events-none' : ''}
                `}
            >
                {/* Glass Background Layer */}
                <div className="absolute inset-0 backdrop-blur-3xl -z-10" />

                <input
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={isProcessing}
                />

                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 p-8 text-center"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
                                <Loader2 className="w-16 h-16 text-primary-400 animate-spin relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white tracking-tight">
                                    {processingState === 'uploading' ? 'Uploading...' : 'Analyzing Resume...'}
                                </h3>
                                <p className="text-gray-400 text-balance max-w-xs mx-auto">
                                    Our AI is reading your resume. This usually takes about 15 seconds.
                                </p>
                            </div>
                        </motion.div>
                    ) : isComplete ? (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-2 shadow-glow-success">
                                <CheckCircle className="w-10 h-10 text-success" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white tracking-tight">Analysis Complete!</h3>
                                <p className="text-gray-400 mt-2">Redirecting to your insights...</p>
                            </div>
                        </motion.div>
                    ) : isError ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-2 shadow-glow-error">
                                <AlertCircle className="w-10 h-10 text-error" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white tracking-tight">Upload Failed</h3>
                                <p className="text-error mt-2 font-medium">{errorMessage || 'Please try again'}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 p-8 text-center"
                        >
                            <motion.div
                                animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`
                                    w-24 h-24 rounded-3xl flex items-center justify-center
                                    transition-all duration-300
                                    ${fileName
                                        ? 'bg-primary-500/15 text-primary-400 shadow-glow-sm'
                                        : 'bg-surface-200 text-gray-500 group-hover:bg-primary-500/10 group-hover:text-primary-400'
                                    }
                                `}
                            >
                                {fileName ? (
                                    <FileText className="w-10 h-10" />
                                ) : (
                                    <Upload className="w-10 h-10" />
                                )}
                            </motion.div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-semibold text-white tracking-tight">
                                    {fileName ? fileName : (isDragging ? 'Drop it here!' : 'Upload your resume')}
                                </h3>
                                <p className="text-gray-400 max-w-xs mx-auto text-balance">
                                    {fileName
                                        ? 'Click to change file'
                                        : 'Drag & drop your PDF or DOCX here, or click to browse'}
                                </p>
                            </div>

                            {!fileName && (
                                <div className="flex gap-3 text-xs font-medium text-gray-500 uppercase tracking-wider mt-2">
                                    <span className="bg-surface-200 px-3 py-1 rounded-full border border-white/[0.06]">PDF</span>
                                    <span className="bg-surface-200 px-3 py-1 rounded-full border border-white/[0.06]">DOCX</span>
                                    <span className="bg-surface-200 px-3 py-1 rounded-full border border-white/[0.06]">Images</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </label>
        </motion.div>
    );
};

export default UploadCard;
