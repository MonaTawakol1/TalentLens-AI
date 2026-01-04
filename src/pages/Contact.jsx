import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Send, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock API
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="container section-padding flex-center" style={{ minHeight: '60vh' }}>
                <Card style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}>
                    <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">Send Another</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h1>
                <p style={{ marginBottom: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Have questions or feedback? We'd love to hear from you.
                </p>

                <Card>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                            <input
                                type="email"
                                required
                                placeholder="john@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="How can we help you?"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <Button type="submit" variant="primary" size="lg" disabled={loading} fullWidth>
                            {loading ? 'Sending...' : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Send Message <Send size={18} /></span>}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Contact;
