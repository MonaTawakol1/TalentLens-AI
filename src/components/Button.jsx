import React from 'react';
import { motion } from 'framer-motion';
import '../index.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false
}) => {

  const baseStyles = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'var(--font-heading)',
  };

  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
    },
    accent: {
      background: 'var(--accent-gradient)', // Gradient for pop
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)', // Glow effect
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '2px solid var(--border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid transparent',
    },
  };

  const sizes = {
    sm: { padding: '0.375rem 0.875rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.75rem', fontSize: '1rem' },
    lg: { padding: '1rem 2.5rem', fontSize: '1.125rem' },
  };

  const style = {
    ...baseStyles,
    ...(disabled ? variants.primary : variants[variant]), // Fallback to avoid crash on disabled but keep logic simpler
    ...sizes[size],
    ...((variant === 'outline' || variant === 'ghost') && disabled ? { borderColor: 'var(--border)', color: 'var(--text-muted)' } : {}),
  };

  // Override for disabled specific look if needed, but opacity handles most.

  return (
    <motion.button
      whileHover={!disabled ? {
        scale: 1.02,
        y: -1,
        boxShadow: variant === 'accent'
          ? '0 10px 25px -5px rgba(14, 165, 233, 0.4)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={style}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default Button;
