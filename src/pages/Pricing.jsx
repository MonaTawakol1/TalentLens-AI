import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { Check, X } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            description: "Perfect for getting started with basic resume checks.",
            features: [
                "1 Resume Analysis per month",
                "Basic Score Overview",
                "Grammar & Spell Check",
                "Limited ATS Compatibility Check"
            ],
            notIncluded: [
                "Detailed AI Feedback",
                "Job Description Matching",
                "Cover Letter Generator",
                "LinkedIn Profile Optimization"
            ],
            cta: "Get Started",
            variant: "outline",
            popular: false
        },
        {
            name: "Pro",
            price: "$10",
            period: "/month",
            description: "Unlock full AI power to land your dream job faster.",
            features: [
                "Unlimited Resume Analysis",
                "Detailed AI Feedback & Suggestions",
                "Full ATS Compatibility Report",
                "Job Description Matching",
                "Keyword Optimization",
                "PDF Report Download"
            ],
            notIncluded: [
                "Cover Letter Generator",
                "LinkedIn Profile Optimization"
            ],
            cta: "Go Pro",
            variant: "primary",
            popular: true
        },
        {
            name: "Premium",
            price: "$25",
            period: "/month",
            description: "The ultimate toolkit for serious career advancement.",
            features: [
                "Everything in Pro",
                "AI Cover Letter Generator",
                "LinkedIn Profile Optimization",
                "Interview Question Generator",
                "Priority Email Support",
                "1-on-1 Human Coach Review (1x/mo)"
            ],
            notIncluded: [],
            cta: "Get Premium",
            variant: "accent",
            popular: false
        }
    ];

    return (
        <div className="container section-padding">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Simple, Transparent Pricing</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                    Choose the plan that fits your career goals. Cancel anytime.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            style={{
                                border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                                position: 'relative',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'visible'
                            }}
                            hoverEffect={true}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'var(--accent)',
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    boxShadow: 'var(--shadow-md)'
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>{plan.price}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{plan.description}</p>
                            </div>

                            <div style={{ marginBottom: '2rem', flex: 1 }}>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Check size={18} color="var(--success)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.notIncluded.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                                            <X size={18} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <Link to="/analyze">
                                    <Button
                                        variant={plan.variant}
                                        fullWidth
                                        size="lg"
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Enterprise or Educational?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    We offer bulk discounts for universities and large organizations.
                </p>
                <Link to="/contact">
                    <Button variant="outline">Contact Sales</Button>
                </Link>
            </div>
        </div>
    );
};

export default Pricing;
