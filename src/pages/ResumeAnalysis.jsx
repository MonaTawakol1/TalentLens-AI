import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import Card from '../components/Card';
import { FileText, Lightbulb, AlertTriangle, Loader2, Sparkles, FileEdit, Copy, Check, X } from 'lucide-react';
import { authenticatedFetch } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../config/api';

const ResumeAnalysis = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // New states for AI generation
    const [isGeneratingJob, setIsGeneratingJob] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [coverLetter, setCoverLetter] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setErrorMessage(null); // Clear any previous error

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (jobDescription) {
                formData.append('jobDescription', jobDescription);
            }

            const response = await authenticatedFetch(`${API_ENDPOINTS.analysis}/analyze`, {
                method: 'POST',
                // Header Content-Type is set automatically for FormData in authenticatedFetch IF not specified, 
                // but authenticatedFetch sets application/json by default.
                // We need to override headers to let browser set boundary for FormData
                headers: {},
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Analysis failed');
            }

            const data = await response.json();
            navigate('/results', {
                state: {
                    analysisResult: data,
                    fileName: file.name,
                    originalFile: file,
                    jobDescription: jobDescription
                }
            });

        } catch (error) {
            console.error("Analysis Error:", error);

            // Extract the error message, prioritizing the one from the backend
            let displayError = "Analysis failed. Please try again.";
            if (error.message) {
                // If it's a "not a resume" error, show it clearly
                if (error.message.includes('not appear to be a resume') || error.message.includes('valid professional CV')) {
                    displayError = error.message;
                } else {
                    displayError = `Analysis failed: ${error.message}`;
                }
            }

            setErrorMessage(displayError);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Generate Job Description with AI
    const handleGenerateJobDescription = async () => {
        if (!file) {
            setErrorMessage('Please upload a resume first to generate a job description.');
            return;
        }

        setIsGeneratingJob(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = sessionStorage.getItem('access_token');
            if (!token) {
                throw new Error('Please log in again to use this feature.');
            }

            console.log('Generating job description with token:', token ? 'exists' : 'missing');

            const response = await authenticatedFetch(`${API_ENDPOINTS.analysis}/generate-job-description`, {
                method: 'POST',
                headers: {}, // Let browser set multipart/form-data boundary
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate job description');
            }

            const data = await response.json();
            setJobDescription(data.jobDescription);
        } catch (error) {
            console.error("Generate Job Description Error:", error);
            setErrorMessage(`Failed to generate job description: ${error.message}`);
        } finally {
            setIsGeneratingJob(false);
        }
    };

    // Generate Cover Letter with AI
    const handleGenerateCoverLetter = async () => {
        if (!file) {
            setErrorMessage('Please upload a resume first to generate a cover letter.');
            return;
        }

        setIsGeneratingCover(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (jobDescription) {
                formData.append('jobDescription', jobDescription);
            }

            const token = sessionStorage.getItem('access_token');
            const response = await fetch(`${API_ENDPOINTS.analysis}/generate-cover-letter`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate cover letter');
            }

            const data = await response.json();
            setCoverLetter(data.coverLetter);
        } catch (error) {
            console.error("Generate Cover Letter Error:", error);
            setErrorMessage(`Failed to generate cover letter: ${error.message}`);
        } finally {
            setIsGeneratingCover(false);
        }
    };

    // Copy cover letter to clipboard
    const handleCopyCoverLetter = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container section-padding">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem', textAlign: 'center' }}
            >
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Analyze Your Resume</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Upload your resume and get instant AI feedback.</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
            }}>
                {/* Left Column - Input */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText color="var(--primary)" />
                            Upload Resume
                        </h2>

                        <FileUpload onFileSelect={setFile} />

                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 600 }}>
                                    Paste Job Description (Optional)
                                </label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!file || isGeneratingJob}
                                    onClick={handleGenerateJobDescription}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--accent)',
                                        padding: '0.5rem 0.75rem'
                                    }}
                                >
                                    {isGeneratingJob ? (
                                        <><Loader2 size={14} className="animate-spin" /> Generating...</>
                                    ) : (
                                        <><Sparkles size={14} /> Generate by AI</>
                                    )}
                                </Button>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here to check for keyword matching, or click 'Generate by AI' to auto-generate one based on your resume..."
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ marginTop: '2rem' }}>
                            <Button
                                fullWidth
                                size="lg"
                                variant="primary"
                                disabled={!file || isAnalyzing}
                                onClick={handleAnalyze}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    'Review Resume'
                                )}
                            </Button>

                            <style>{`
                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                 .animate-spin { animation: spin 1s linear infinite; }
               `}</style>
                        </div>
                    </Card>
                </motion.div>

                {/* Right Column - Guidance */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card style={{ height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lightbulb color="var(--warning)" />
                            Tips for Best Results
                        </h2>

                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>1</div>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>Use Standard Formats</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>PDFs generated from Word or Google Docs work best. Avoid image-based PDFs.</p>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>2</div>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>Include Keywords</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>If you have a target job text, paste it to get a compatibility score.</p>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                                    <AlertTriangle size={16} />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>Avoid Fancy Layouts</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Columns, graphics, and tables can confuse ATS parsers. Keep it simple.</p>
                                </div>
                            </li>
                        </ul>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#F0FDFA', borderRadius: 'var(--radius-md)', border: '1px solid #CCFBF1' }}>
                            <h4 style={{ color: 'var(--accent-hover)', marginBottom: '0.5rem' }}>Privacy Guarantee</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>
                                Your resume is processed securely and is not shared with third parties. We value your privacy.
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Error Popup Modal */}
            {errorMessage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            maxWidth: '450px',
                            width: '90%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <AlertTriangle size={28} color="#DC2626" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem', color: '#DC2626' }}>Upload Error</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>There was a problem with your file</p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ color: '#991B1B', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {errorMessage}
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setErrorMessage(null)}
                        >
                            Try Again
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* Cover Letter Modal */}
            {coverLetter && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            maxWidth: '700px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileEdit size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Your Cover Letter</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>AI-generated based on your resume</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCoverLetter(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        <div style={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.7',
                            fontSize: '0.95rem',
                            color: 'var(--text-main)'
                        }}>
                            {coverLetter}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setCoverLetter(null)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleCopyCoverLetter}
                            >
                                {copied ? (
                                    <><Check size={18} /> Copied!</>
                                ) : (
                                    <><Copy size={18} /> Copy to Clipboard</>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalysis;
