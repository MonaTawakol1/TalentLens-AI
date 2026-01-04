import React from 'react';
import Card from '../components/Card';
import { Bot, Lock, Database } from 'lucide-react';

const About = () => {
    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>About TalentLens AI</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem', lineHeight: 1.6 }}>
                    We are on a mission to democratize career success by providing enterprise-grade resume intelligence to everyone.
                </p>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>How It Works</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                        TalentLens AI utilizes state-of-the-art Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to analyze your resume against millions of successful job applications and job descriptions.
                    </p>
                    <p style={{ lineHeight: 1.6 }}>
                        Unlike traditional keyword matchers, our AI understands context, nuance, and the "story" your resume tells, offering feedback that mimics a human recruiter's perspective but with data-driven precision.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Our Technology</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <Card>
                            <Bot size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Advanced NLP</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Understanding semantic meaning, not just keyword counting.</p>
                        </Card>
                        <Card>
                            <Database size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Sector Benchmarks</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Comparisons against top performing resumes in your specific industry.</p>
                        </Card>
                        <Card>
                            <Lock size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Private & Secure</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Data processing happens in isolated environments. We never sell your data.</p>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
