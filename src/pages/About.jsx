import React from 'react';
import Card from '../components/Card';
import { Bot, Lock, Database, Users, Code, Search } from 'lucide-react';

const About = () => {
    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>About TalentLens AI</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem', lineHeight: 1.6 }}>
                    We are bridging the gap between talent and opportunity. TalentLens AI is your personal career optimization platform, simulating the evaluation process of top-tier recruiters and technical hiring managers.
                </p>

                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>The "Black Box" Problem</h2>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <p style={{ lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '1rem' }}>
                            Did you know that <strong>75% of resumes</strong> are rejected by Applicant Tracking Systems (ATS) before a human ever sees them? Even when they do pass, they often fail to communicate the right "story" to recruiters.
                        </p>
                        <p style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                            TalentLens AI was built to solve this. We don't just check for typos; we provide a comprehensive, multi-angle analysis that helps you optimize for both the <strong>Machine (ATS)</strong> and the <strong>Human (Recruiter)</strong>.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Our Multi-Agent Approach</h2>
                    <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto', color: 'var(--text-muted)' }}>
                        Your resume is analyzed by three specialized AI agents, working together to give you the most complete feedback possible.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <Card hoverEffect>
                            <div style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                <Search size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>The ATS Agent</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Checks for formatting issues, keyword optimizing, and readability to ensure your resume gets past automated filters.
                            </p>
                        </Card>

                        <Card hoverEffect>
                            <div style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
                                <Users size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>The Recruiter Agent</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Evaluates the "human" impact—clarity, strong action verbs, and narrative flow—to make sure you stand out to hiring managers.
                            </p>
                        </Card>

                        <Card hoverEffect>
                            <div style={{ marginBottom: '1.5rem', color: 'var(--success)' }}>
                                <Code size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>The Tech Agent</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Performs a deep technical gap analysis, comparing your hard skills (e.g., Docker, React) directly against the Job Description.
                            </p>
                        </Card>
                    </div>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Why Trust Us?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Bot size={40} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Powered by LLMs</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Context-aware analysis using advanced OpenAI models.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Database size={40} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-time Comparison</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Benchmarked against millions of successful profiles.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Lock size={40} color="var(--success)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure & Private</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your data is yours. We encrypt everything and never sell it.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
