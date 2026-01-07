import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, User as UserIcon, LogOut } from 'lucide-react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const styles = {
        nav: {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0.75rem 0',
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: 'var(--primary)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.03em',
        },
        linksDesktop: {
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
        },
        link: {
            fontWeight: 500,
            color: 'var(--text-muted)',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            position: 'relative',
        },
        activeLink: {
            color: 'var(--primary)',
            fontWeight: 600,
        },
        mobileMenu: {
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99
        }
    };

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <div style={{
                        background: 'var(--accent-gradient)',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                        color: 'white'
                    }}>
                        <BrainCircuit size={24} />
                    </div>
                    <span>TalentLens AI</span>
                </Link>

                {/* Desktop Links */}
                <div style={styles.linksDesktop} className="desktop-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            style={location.pathname === link.path ? { ...styles.link, ...styles.activeLink } : styles.link}
                            className="nav-item"
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'var(--accent)',
                                        borderRadius: '4px'
                                    }}
                                />
                            )}
                        </Link>
                    ))}

                    <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/analyze">
                                <Button variant="ghost" size="sm">New Scan</Button>
                            </Link>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <div style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '50%',
                                        background: 'var(--primary-gradient)',
                                        color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1rem'
                                    }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </div>
                            </Link>
                            <div onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} title="Logout">
                                <LogOut size={20} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" style={{ ...styles.link, fontWeight: 600 }}>Log In</Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', color: 'var(--primary)' }}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={styles.mobileMenu}
                        className="mobile-menu"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                style={{ fontSize: '1.1rem', fontWeight: 500, color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr style={{ borderColor: 'var(--border)' }} />
                        {user ? (
                            <>
                                <Link to="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                                    <UserIcon size={20} /> My Profile
                                </Link>
                                <Link to="/analyze" onClick={() => setIsOpen(false)}>
                                    <Button variant="accent" fullWidth>New Analysis</Button>
                                </Link>
                                <div onClick={() => { handleLogout(); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--danger)', cursor: 'pointer' }}>
                                    <LogOut size={18} /> Logout
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} style={{ fontSize: '1.1rem', textAlign: 'center' }}>Log In</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" fullWidth>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
        .desktop-nav { display: flex; }
        .mobile-toggle { display: none; }
        .nav-item:hover { color: var(--primary) !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
