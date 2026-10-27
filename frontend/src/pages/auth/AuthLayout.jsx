import React from 'react';
import { Logo } from '../../components/common/Logo';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      className="hero-glow-mesh"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Logo to="/" size="md" width={216} height={72} scaleX={1} scaleY={1} />
      </div>

      {/* Auth Card Container */}
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.375rem' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Minimal Footer */}
      <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Protected by JobDheko Shield • Terms of Service • Privacy Policy
      </div>
    </div>
  );
};
