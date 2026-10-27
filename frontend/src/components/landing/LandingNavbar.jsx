import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const LandingNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header
      className="landing-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: '#070C0A',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #142019',
      }}
    >
      <div
        className="container landing-navbar-container"
        style={{
          minHeight: '94px',
          height: 'auto',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo (Navbar Top) */}
        <Logo to="/" size="md" width={216} height={72} scaleX={1.05} className="landing-navbar-logo" />

        {/* Navigation Links */}
        <nav
          className="hide-on-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#94A3B8',
          }}
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              const hero = document.getElementById('home');
              if (hero) {
                hero.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6ff309ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
          >
            Home
          </a>
          <a
            href="#jobs"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('jobs');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6ff309ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
          >
            Jobs
          </a>
          <a
            href="#taxonomy"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('taxonomy');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6ff309ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
          >
            Explore
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6ff309ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
          >
            About
          </a>
        </nav>

        {/* Auth Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <Link to="/app" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  backgroundColor: '#A3E635',
                  color: '#0A0F0D',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 16px rgba(163, 230, 53, 0.35)',
                }}
              >
                <span>Dashboard</span>
                <Icon name="arrow-right" size={15} color="#0A0F0D" />
              </button>
            </Link>
          ) : (
            <>
              <Link to="/signin" className="landing-sign-in" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #233329',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3D5444';
                    e.currentTarget.style.backgroundColor = '#101714';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#233329';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#A3E635',
                    color: '#0A0F0D',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 0 20px rgba(163, 230, 53, 0.3)',
                    transition: 'transform var(--transition-fast), filter var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <span>Get Started</span>
                  <Icon name="arrow-right" size={15} color="#0A0F0D" />
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
