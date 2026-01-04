import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '3rem 0',
            marginTop: 'auto',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
        },
        title: {
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.2rem',
        },
        linkList: {
            listStyle: 'none',
        },
        linkItem: {
            marginBottom: '0.5rem',
        },
        link: {
            color: 'var(--text-muted)', // adjust for dark bg
            opacity: 0.8,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
        },
        copyright: {
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1rem',
            textAlign: 'center',
            opacity: 0.6,
            fontSize: '0.9rem',
        }
    };

    return (
        <footer style={styles.footer}>
            <div className="container">
                <div style={styles.grid}>
                    <div>
                        <h3 style={styles.title}>TalentLens AI</h3>
                        <p style={{ opacity: 0.8 }}>AI-powered intelligence to boost your career prospects.</p>
                    </div>
                    <div>
                        <h4 style={styles.title}>Product</h4>
                        <ul style={styles.linkList}>
                            <li style={styles.linkItem}><Link to="/analyze" style={{ color: 'white', opacity: 0.8 }}>Analyze Resume</Link></li>
                            <li style={styles.linkItem}><Link to="/pricing" style={{ color: 'white', opacity: 0.8 }}>Pricing</Link></li>
                            <li style={styles.linkItem}><Link to="/results" style={{ color: 'white', opacity: 0.8 }}>Sample Report</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={styles.title}>Company</h4>
                        <ul style={styles.linkList}>
                            <li style={styles.linkItem}><Link to="/about" style={{ color: 'white', opacity: 0.8 }}>About Us</Link></li>
                            <li style={styles.linkItem}><Link to="/contact" style={{ color: 'white', opacity: 0.8 }}>Contact</Link></li>
                            <li style={styles.linkItem}><Link to="/privacy" style={{ color: 'white', opacity: 0.8 }}>Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div style={styles.copyright}>
                    &copy; {new Date().getFullYear()} TalentLens AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
