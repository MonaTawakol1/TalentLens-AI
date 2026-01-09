import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import Card from '../components/Card';
import { FileText, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const ResumeAnalysis = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (jobDescription) {
                formData.append('jobDescription', jobDescription);
            }

            const token = sessionStorage.getItem('access_token');
            const response = await fetch(`${API_ENDPOINTS.analysis}/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type is set automatically for FormData
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Analysis failed');
            }

            const data = await response.json();
            navigate('/results', { state: { analysisResult: data, fileName: file.name } });

        } catch (error) {
            console.error("Analysis Error:", error);
            alert("Analysis failed: " + error.message);
        } finally {
            setIsAnalyzing(false);
        }
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
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Paste Job Description (Optional)
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here to check for keyword matching..."
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
        </div>
    );
};

export default ResumeAnalysis;
