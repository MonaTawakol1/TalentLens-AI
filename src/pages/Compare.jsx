import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Trophy, TrendingUp } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const Compare = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysis1, analysis2 } = location.state || {};

    if (!analysis1 || !analysis2) {
        return (
            <div className="container section-padding" style={{ textAlign: 'center' }}>
                <h2>No analysis selected for comparison</h2>
                <Button onClick={() => navigate('/profile')}>Go Back to Profile</Button>
            </div>
        );
    }

    // Helper to extract data normalized
    const extractData = (analysis) => {
        // Check if from DB (has feedback object) or fresh
        const isDB = analysis.feedback && typeof analysis.feedback === 'object';
        const feedback = isDB ? analysis.feedback : (analysis.feedback || {});

        return {
            title: analysis.title || analysis.fileName || 'Resume Analysis',
            date: new Date(analysis.createdAt || Date.now()).toLocaleDateString(),
            score: analysis.score || analysis.overallScore || 0,
            atsScore: feedback.atsScore || analysis.atsScore || 0,
            jobMatch: feedback.jobMatch || analysis.jobMatch || 0,
            radarData: feedback.skillGap?.radarData || analysis.skillGap?.radarData || [],
            summary: feedback.summary || analysis.summary || ''
        };
    };

    const d1 = extractData(analysis1);
    const d2 = extractData(analysis2);

    // Prepare Radar Data (Merge both datasets)
    // Assuming standard subjects: Technical, Leadership, Communication, Analytical, Domain
    const standardSubjects = ['Technical', 'Leadership', 'Communication', 'Analytical', 'Domain'];
    const radarChartData = standardSubjects.map(subject => {
        const val1 = d1.radarData.find(d => d.subject === subject)?.A || 0;
        const val2 = d2.radarData.find(d => d.subject === subject)?.A || 0;
        return {
            subject,
            A: val1, // Dataset 1
            B: val2, // Dataset 2
            fullMark: 100
        };
    });

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-success';
        if (score >= 60) return 'text-warning';
        return 'text-danger';
    };

    const getDifference = (val1, val2) => {
        const diff = val2 - val1;
        const sign = diff > 0 ? '+' : '';
        const color = diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--danger)' : 'var(--text-muted)';
        return <span style={{ color, fontSize: '0.9rem', fontWeight: 'bold' }}>({sign}{diff})</span>;
    };

    return (
        <div className="container section-padding">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                    <ArrowLeft size={18} /> Back to Profile
                </Button>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Compare Analyses <span style={{ fontSize: '1rem', background: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>Side-by-Side</span>
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Header Row */}
                <Card style={{ borderTop: '4px solid var(--primary)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--primary)' }}>Analysis A (Older)</h3>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{d1.title}</p>
                    <p style={{ color: 'var(--text-muted)' }}>{d1.date}</p>
                </Card>
                <Card style={{ borderTop: '4px solid var(--accent)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--accent)' }}>Analysis B (Newer)</h3>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{d2.title}</p>
                    <p style={{ color: 'var(--text-muted)' }}>{d2.date}</p>
                </Card>

                {/* Scores Row */}
                <Card>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Score</div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{d1.score}</div>
                    </div>
                    <ProgressBar value={d1.atsScore} label="ATS Score" color="var(--primary)" />
                    <ProgressBar value={d1.jobMatch} label="Job Match" color="var(--secondary)" />
                </Card>

                <Card>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Score</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{d2.score}</span>
                            {getDifference(d1.score, d2.score)}
                        </div>
                    </div>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>ATS Score</span>
                        {getDifference(d1.atsScore, d2.atsScore)}
                    </div>
                    <ProgressBar value={d2.atsScore} showLabel={false} color="var(--primary)" />

                    <div style={{ marginTop: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Job Match</span>
                        {getDifference(d1.jobMatch, d2.jobMatch)}
                    </div>
                    <ProgressBar value={d2.jobMatch} showLabel={false} color="var(--secondary)" />
                </Card>
            </div>

            {/* Radar Comparison */}
            <Card style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Target /> Skill Gap Comparison
                </h3>
                <div style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Analysis A" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                            <Radar name="Analysis B" dataKey="B" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

        </div>
    );
};

export default Compare;
