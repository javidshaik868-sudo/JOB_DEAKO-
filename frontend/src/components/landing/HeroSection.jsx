import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons/Icon';
import { TrustedCompaniesLogos } from './TrustedCompaniesLogos';
import { Orb3dDots } from '../common/Orb3dDots';

export const HeroSection = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/app/jobs?${params.toString()}`);
  };

  const handlePopularClick = (term) => {
    navigate(`/app/jobs?q=${encodeURIComponent(term)}`);
  };

  const popularTags = ['Software Engineer', 'AI Engineer', 'Full Stack', 'Data Analyst'];

  const stats = [
    { icon: 'users', value: '150K+', label: 'Candidates' },
    { icon: 'file-text', value: '12,000+', label: 'Verified Jobs' },
    { icon: 'trending-up', value: '94%', label: 'Match Rate' },
    { icon: 'briefcase', value: '₹18.4 LPA', label: 'Avg Package' },
  ];

  return (
    <section
      id="home"
      className="landing-hero"
      style={{
        position: 'relative',
        backgroundColor: '#080D0B',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Top-Left Ambient Curved Glow */}
      <div
        className="orb-animate-left"
        style={{
          position: 'absolute',
          top: '-140px',
          left: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(163, 230, 53, 0.07) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top-Right Ambient Curved Glow */}
      <div
        className="orb-animate-right"
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, rgba(163, 230, 53, 0.06) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 3D Animated Dots Background Effect (Single Full-Section Layer) */}
      <Orb3dDots
        spacing={16}
        hoverRadius={210}
      />

      {/* Main Hero Header and Companies Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            width: '100%',
            maxWidth: '1380px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Badge Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              backgroundColor: 'rgba(16, 28, 22, 0.85)',
              border: '1px solid #1E3827',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#A3E635',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '11px', color: '#A3E635' }}>✦</span>
            <span>NEXT-GEN CAREER INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#FFFFFF',
              margin: '0 0 0.5rem 0',
              maxWidth: '960px',
            }}
          >
            Find Your Next Opportunity. <br />
            <span style={{ color: '#A3E635' }}>Build Your Future.</span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#9CA3AF',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: '0.75rem auto 2.25rem',
            }}
          >
            Discover curated tech roles and AI-matched opportunities.
          </p>

          {/* Search Form Bar */}
          <form
            onSubmit={handleSearch}
            className="landing-search-form"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              width: '100%',
              maxWidth: '920px',
              gap: '0.75rem',
            }}
          >
            {/* Keyword Input */}
            <div
              className="landing-search-field"
              style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0 1rem',
              }}
            >
              <Icon name="search" size={19} color="#6B7280" />
              <input
                type="text"
                placeholder="Job title, skill, company"
                className="landing-search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  height: 42,
                  fontSize: '0.9375rem',
                  color: '#FFFFFF',
                }}
              />
            </div>

            {/* Vertical Divider */}
            <div
              style={{
                width: 1,
                height: 28,
                backgroundColor: '#1F2D25',
              }}
              className="hide-on-mobile"
            />

            {/* Location Input */}
            <div
              className="landing-search-field"
              style={{
                flex: '1 1 240px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0 1rem',
              }}
            >
              <Icon name="location" size={19} color="#6B7280" />
              <input
                type="text"
                placeholder="Location"
                className="landing-search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  height: 42,
                  fontSize: '0.9375rem',
                  color: '#FFFFFF',
                }}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="landing-search-button"
              style={{
                backgroundColor: '#A3E635',
                color: '#0A0F0D',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.85rem',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 0 20px rgba(163, 230, 53, 0.35)',
                transition: 'filter var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
            >
              <span>Search Jobs</span>
              <Icon name="arrow-right" size={16} color="#0A0F0D" />
            </button>
          </form>

          {/* Popular Searches Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              marginTop: '1.35rem',
            }}
          >
            <span style={{ color: '#6B7280', fontWeight: 500, marginRight: '0.25rem' }}>Popular:</span>
            {popularTags.map((term, index) => (
              <React.Fragment key={term}>
                <button
                  type="button"
                  onClick={() => handlePopularClick(term)}
                  style={{
                    backgroundColor: '#0F1714',
                    border: '1px solid #1E3325',
                    color: '#A3E635',
                    padding: '0.25rem 0.85rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#A3E635';
                    e.currentTarget.style.backgroundColor = '#16241E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1E3325';
                    e.currentTarget.style.backgroundColor = '#0F1714';
                  }}
                >
                  {term}
                </button>
                {index < popularTags.length - 1 && (
                  <span style={{ color: '#374151', fontSize: '0.85rem' }}>·</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Trusted By Hiring Teams Section */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className="landing-trusted-companies"
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#6B7280',
                textTransform: 'uppercase',
              }}
              className="landing-trusted-label"
            >
              TRUSTED BY HIRING TEAMS FROM 500+ COMPANIES
            </div>

            <TrustedCompaniesLogos />
          </div>
        </div>
      </div>

      {/* Full-Width Divider Line With 0 Padding */}
      <div
        className="landing-hero-divider"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#142019',
          padding: 0,
        }}
      />

      {/* 4-Metrics Stats Row */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            width: '100%',
            maxWidth: '1380px',
            margin: '0 auto',
            alignItems: 'center',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.125rem',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#A3E635', display: 'flex', alignItems: 'center' }}>
                <Icon name={stat.icon} size={30} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8E9B95', marginTop: '0.2rem' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
