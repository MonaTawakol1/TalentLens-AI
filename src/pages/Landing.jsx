import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle, Zap, TrendingUp, BrainCircuit, Star, BarChart3, Users } from 'lucide-react';

const Landing = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <section style={{
                padding: '8rem 1rem 6rem',
                textAlign: 'center',
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Animated Background Blobs */}
                <motion.div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    zIndex: -1,
                    y: y1
                }} />
                <motion.div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    zIndex: -1,
                    y: y2
                }} />

                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span style={{
                            background: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(14,165,233,0.3)',
                            backdropFilter: 'blur(4px)',
                            color: 'var(--primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <Star size={14} fill="var(--warning)" color="var(--warning)" />
                            #1 AI Resume Analyzer
                        </span>
                    </motion.div>

                    <motion.h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em'
                    }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Craft a Resume That <br />
                        <span className="text-gradient">Gets You Hired.</span>
                    </motion.h1>

                    <motion.p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-muted)',
                        marginBottom: '3rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Don't let an ATS filter reject your dream job. Get instant, AI-powered feedback to optimize your resume for humans and bots alike.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link to="/analyze">
                            <Button size="lg" variant="accent" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Analyze My Resume</Button>
                        </Link>
                        <Link to="/results">
                            <Button size="lg" variant="outline" style={{ background: 'rgba(255,255,255,0.5)' }}>View Sample Report</Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="var(--success)" /> Free & Premium Plans</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="var(--success)" /> Quick Sign-up</div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
                <div className="container" style={{ padding: '3rem 1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                        {[
                            { icon: Users, label: 'Users Helped', value: '50,000+' },
                            { icon: BarChart3, label: 'Resumes Improved', value: '120,000+' },
                            { icon: BrainCircuit, label: 'Data Points', value: '5 Million' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                    <stat.icon size={24} />
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container section-padding">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Three simple steps to a better resume</p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}
                >
                    <Card hoverEffect style={{ height: '100%' }}>
                        <div style={{ marginBottom: '1.5rem', width: '60px', height: '60px', background: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                            <Zap size={32} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>1. Upload Resume</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Drag and drop your PDF or DOCX file. Our secure system processes it instantly in a private sandbox.</p>
                    </Card>

                    <Card hoverEffect style={{ height: '100%' }}>
                        <div style={{ marginBottom: '1.5rem', width: '60px', height: '60px', background: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                            <BrainCircuit size={32} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>2. AI Analysis</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Our advanced LLM algorithms check for ATS compatibility, keyword matching, and structural integrity.</p>
                    </Card>

                    <Card hoverEffect style={{ height: '100%' }}>
                        <div style={{ marginBottom: '1.5rem', width: '60px', height: '60px', background: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                            <TrendingUp size={32} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>3. Get Results</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Receive a detailed score (0-100) and actionable tips to improve your resume immediately.</p>
                    </Card>
                </motion.div>
            </section>

            {/* Decorative Section */}
            <section style={{ padding: '6rem 1rem', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{
                        background: 'var(--primary)',
                        borderRadius: '2rem',
                        padding: '4rem 2rem',
                        position: 'relative',
                        color: 'white',
                        textAlign: 'center',
                        overflow: 'hidden'
                    }}>
                        {/* Abstract shapes */}
                        <div style={{ position: 'absolute', top: '-50%', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 0% 0%, rgba(14,165,233,0.3), transparent 50%)' }}></div>
                        <div style={{ position: 'absolute', bottom: '-50%', right: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 100% 100%, rgba(45,212,191,0.3), transparent 50%)' }}></div>

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to stand out?</h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                                Join thousands of professionals who have optimized their resumes and landed interviews at top companies.
                            </p>
                            <Link to="/analyze">
                                <Button variant="accent" size="lg" style={{ boxShadow: '0 0 30px rgba(14,165,233,0.5)' }}>
                                    Start Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
