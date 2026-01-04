import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = false, style = {} }) => {
    const baseStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    return (
        <motion.div
            initial={false} // Prevent initial animation glitch
            whileHover={hoverEffect ? {
                y: -5,
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                borderColor: 'rgba(14, 165, 233, 0.3)'
            } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={baseStyle}
            className={className}
        >
            {/* Subtle top gradient line for "premium" feel */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), transparent)' }}></div>
            {children}
        </motion.div>
    );
};

export default Card;
