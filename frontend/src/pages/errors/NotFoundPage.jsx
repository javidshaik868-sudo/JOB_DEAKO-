import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Icon } from '../../components/icons/Icon';

export const NotFoundPage = () => {
  return (
    <div
      className="hero-glow-mesh"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1rem',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Logo to="/" size="md" />
      </div>

      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 800 }}>404</span>
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '440px', marginBottom: '2rem' }}>
        The page or application view you requested could not be located. It may have moved or been retired.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/app">
          <Button variant="primary" size="md" leftIcon={<Icon name="home" size={16} />}>
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="md">
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
