import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, color = 'var(--accent)', label = '' }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div style={{ margin: '1rem 0' }}>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{value}/{max}</span>
                </div>
            )}
            <div style={{
                height: '10px',
                backgroundColor: '#E2E8F0',
                borderRadius: '999px',
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '999px'
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
