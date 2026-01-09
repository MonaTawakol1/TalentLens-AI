import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { Download, RefreshCw, Check, X as XIcon, ChevronRight, ArrowRight, ShieldCheck, AlertTriangle, Lightbulb, List, Layers, Star, Target } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isPrinting, setIsPrinting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get data from navigation state (passed from ResumeAnalysis page)
        if (location.state?.analysisResult) {
            const result = location.state.analysisResult;
            // Transform the feedback data to match the UI structure
            const transformedData = {
                overallScore: result.overallScore || result.score || 0,
                atsScore: result.atsScore || 75,
                jobMatch: result.jobMatch || 60,
                summary: result.summary || result.feedback?.summary || "Analysis complete.",
                topPriority: result.topPriority || result.feedback?.improvements?.[0] || "Review the detailed feedback below.",

                sectionReviews: result.sectionReviews || [
                    {
                        name: "Overall Assessment",
                        score: result.overallScore || result.score || 70,
                        strengths: result.feedback?.strengths || ["Resume uploaded successfully"],
                        weaknesses: result.feedback?.weaknesses || ["Review detailed analysis"],
                        missing: [],
                        suggestions: result.feedback?.improvements || ["See action plan"]
                    }
                ],

                atsCheck: result.atsCheck || {
                    missingKeywords: [],
                    genericWords: [],
                    actionableSteps: result.feedback?.improvements || []
                },

                skillGap: result.skillGap || {
                    radarData: [
                        { subject: 'Technical', A: 70, B: 100, fullMark: 100 },
                        { subject: 'Leadership', A: 60, B: 100, fullMark: 100 },
                        { subject: 'Communication', A: 75, B: 100, fullMark: 100 },
                        { subject: 'Analytical', A: 65, B: 100, fullMark: 100 },
                        { subject: 'Domain', A: 70, B: 100, fullMark: 100 }
                    ],
                    barData: []
                },

                actionPlan: result.actionPlan || {
                    high: result.feedback?.improvements?.slice(0, 2) || ["Review your resume"],
                    medium: result.feedback?.improvements?.slice(2, 4) || [],
                    optional: []
                },

                improvements: result.improvements || [
                    {
                        section: "Professional Summary",
                        before: "Generic professional summary",
                        after: "See the AI suggestions above for personalized improvements"
                    }
                ]
            };
            setData(transformedData);
        } else {
            // No data passed, redirect to analyze page
            setError("No analysis data found. Please upload a resume first.");
        }
    }, [location.state]);

    if (error) return (
        <div className="container section-padding flex-center" style={{ minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ marginBottom: '1rem' }}>{error}</h2>
                <Link to="/analyze">
                    <Button variant="primary">
                        <RefreshCw size={18} /> Upload Resume
                    </Button>
                </Link>
            </div>
        </div>
    );

    if (!data) return (
        <div className="container section-padding flex-center" style={{ minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{ marginBottom: '1rem' }}><RefreshCw size={32} color="var(--accent)" /></div>
                <p>Loading analysis results...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'skills', label: 'Skill Gap' },
        { id: 'sections', label: 'Section Review' },
        { id: 'ats', label: 'ATS Check' },
        { id: 'plan', label: 'Action Plan' },
    ];

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 500);
    };

    return (
        <div className="container section-padding">
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-break-before { page-break-before: always; }
                    body { background: white; }
                    .container { max-width: 100%; padding: 0; }
                }
            `}</style>

            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Analysis Results
                        <span style={{ fontSize: '1rem', background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>AI Powered</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>File: <span style={{ fontWeight: 600 }}>{location.state?.fileName || 'Uploaded Resume'}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="outline" onClick={handlePrint}>
                        <Download size={18} /> Download Report
                    </Button>
                    <Link to="/analyze">
                        <Button variant="primary">
                            <RefreshCw size={18} /> New Analysis
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            {!isPrinting && (
                <div className="no-print" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                cursor: 'pointer',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isPrinting ? '3rem' : '0' }}>

                {/* OVERVIEW TAB */}
                {(activeTab === 'overview' || isPrinting) && (
                    <motion.div
                        key="overview"
                        initial={!isPrinting ? { opacity: 0, y: 10 } : {}}
                        animate={!isPrinting ? { opacity: 1, y: 0 } : {}}
                        exit={!isPrinting ? { opacity: 0, y: -10 } : {}}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                    >
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem' }}>Total Score</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    position: 'relative', width: '180px', height: '180px', borderRadius: '50%',
                                    background: `conic-gradient(var(--accent) ${data.overallScore}%, #E2E8F0 0)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '160px', height: '160px', background: 'white', borderRadius: '50%',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>{data.overallScore}</span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ 100 Points</span>
                                    </div>
                                </div>
                            </div>
                            <ProgressBar value={data.atsScore} color="var(--success)" label="ATS Compatibility" />
                            <ProgressBar value={data.jobMatch} color="var(--primary)" label="Job Description Match" />
                        </Card>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <Card style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Lightbulb color="var(--warning)" size={20} /> AI Summary
                                </h3>
                                <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
                                    {data.summary}
                                </p>
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Top Priority:</span>
                                    <p style={{ fontSize: '0.95rem' }}>{data.topPriority}</p>
                                </div>
                            </Card>
                            {data.improvements && data.improvements[0] && (
                                <Card style={{ flex: 1, border: '1px solid var(--accent)', background: 'rgba(240, 253, 250, 0.5)' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>AI Rewrite Preview</h3>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Before</div>
                                    <div style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#64748B' }}>"{data.improvements[0].before}"</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 600 }}>After</div>
                                    <div>"{data.improvements[0].after}"</div>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* SKILLS GAP TAB */}
                {(activeTab === 'skills' || isPrinting) && (
                    <motion.div
                        key="skills"
                        initial={!isPrinting ? { opacity: 0, y: 10 } : {}}
                        animate={!isPrinting ? { opacity: 1, y: 0 } : {}}
                        exit={!isPrinting ? { opacity: 0, y: -10 } : {}}
                    >
                        <h2 style={{ marginBottom: '2rem' }}>Skill Gap Analysis</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            <Card>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Target color="var(--primary)" /> Proficiency Radar
                                </h3>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.skillGap.radarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                            <Radar name="You" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.5} />
                                            <Radar name="Ideal Candidate" dataKey="B" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {data.skillGap.barData && data.skillGap.barData.length > 0 && (
                                <Card>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <List color="var(--danger)" /> Skill Match
                                    </h3>
                                    <div style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={data.skillGap.barData}
                                                layout="vertical"
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={100} />
                                                <Tooltip />
                                                <Bar dataKey="status" fill="var(--accent)" background={{ fill: '#eee' }} name="Your match %" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                )}


                {/* SECTIONS TAB */}
                {(activeTab === 'sections' || isPrinting) && (
                    <motion.div
                        key="sections"
                        initial={!isPrinting ? { opacity: 0, y: 10 } : {}}
                        animate={!isPrinting ? { opacity: 1, y: 0 } : {}}
                        exit={!isPrinting ? { opacity: 0, y: -10 } : {}}
                        style={{ display: 'grid', gap: '2rem' }}
                    >
                        {data.sectionReviews.map((section, idx) => (
                            <Card key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1.5rem' }}>{section.name}</h3>
                                    <div style={{ background: section.score > 70 ? '#DCFCE7' : '#FEF3C7', color: section.score > 70 ? '#166534' : '#B45309', padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: 600 }}>
                                        Section Score: {section.score}/100
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={18} /> Strengths</h4>
                                        <ul style={{ listStyle: 'none' }}>
                                            {section.strengths.map((item, i) => (
                                                <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', gap: '0.5rem' }}>
                                                    <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', marginTop: '8px' }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={18} /> Weaknesses</h4>
                                        <ul style={{ listStyle: 'none' }}>
                                            {section.weaknesses.map((item, i) => (
                                                <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', gap: '0.5rem' }}>
                                                    <div style={{ width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%', marginTop: '8px' }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {(section.missing?.length > 0 || section.suggestions?.length > 0) && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                            {section.missing?.length > 0 && (
                                                <div>
                                                    <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Missing Elements</h5>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {section.missing.map((m, i) => (
                                                            <span key={i} style={{ background: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {section.suggestions?.length > 0 && (
                                                <div>
                                                    <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Suggestions</h5>
                                                    <ul style={{ paddingLeft: '1rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                                        {section.suggestions.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </motion.div>
                )}

                {/* ATS CHECK TAB */}
                {(activeTab === 'ats' || isPrinting) && (
                    <motion.div
                        key="ats"
                        initial={!isPrinting ? { opacity: 0, y: 10 } : {}}
                        animate={!isPrinting ? { opacity: 1, y: 0 } : {}}
                        exit={!isPrinting ? { opacity: 0, y: -10 } : {}}
                    >
                        <Card>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                <h2>ATS Compatibility Check</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Can the bots read your resume?</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {data.atsCheck.missingKeywords?.length > 0 && (
                                    <div style={{ background: '#FEF2F2', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
                                        <h3 style={{ color: '#991B1B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <XIcon size={20} /> Missing Keywords
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>These keywords are missing from your profile:</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {data.atsCheck.missingKeywords.map((k, i) => (
                                                <span key={i} style={{ background: 'white', color: '#991B1B', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {data.atsCheck.genericWords?.length > 0 && (
                                    <div style={{ background: '#FFF7ED', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #FED7AA' }}>
                                        <h3 style={{ color: '#9A3412', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <AlertTriangle size={20} /> Generic Words
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Avoid these overused buzzwords:</p>
                                        <ul style={{ listStyle: 'none' }}>
                                            {data.atsCheck.genericWords.map((w, i) => (
                                                <li key={i} style={{ marginBottom: '0.5rem', color: '#9A3412', display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{ opacity: 0.6 }}>•</span> {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {data.atsCheck.actionableSteps?.length > 0 && (
                                <div style={{ marginTop: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Actionable Fixes</h3>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {data.atsCheck.actionableSteps.map((step, i) => (
                                            <div key={i} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '2rem', height: '2rem', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                                                <p>{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                )}

                {/* ACTION PLAN TAB */}
                {(activeTab === 'plan' || isPrinting) && (
                    <motion.div
                        key="plan"
                        initial={!isPrinting ? { opacity: 0, y: 10 } : {}}
                        animate={!isPrinting ? { opacity: 1, y: 0 } : {}}
                        exit={!isPrinting ? { opacity: 0, y: -10 } : {}}
                    >
                        <h2 style={{ marginBottom: '2rem' }}>Your Personalized Improvement Plan</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {data.actionPlan.high?.length > 0 && (
                                <Card style={{ borderLeft: '6px solid var(--danger)' }}>
                                    <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertTriangle /> High Priority (Do this now)
                                    </h3>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {data.actionPlan.high.map((item, i) => (
                                            <li key={i} style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>{item}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {data.actionPlan.medium?.length > 0 && (
                                <Card style={{ borderLeft: '6px solid var(--warning)' }}>
                                    <h3 style={{ color: 'var(--warning)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Layers /> Medium Priority
                                    </h3>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {data.actionPlan.medium.map((item, i) => (
                                            <li key={i} style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>{item}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {data.actionPlan.optional?.length > 0 && (
                                <Card style={{ borderLeft: '6px solid var(--success)' }}>
                                    <h3 style={{ color: 'var(--success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Star /> Optional Enhancements
                                    </h3>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {data.actionPlan.optional.map((item, i) => (
                                            <li key={i} style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>{item}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Results;
