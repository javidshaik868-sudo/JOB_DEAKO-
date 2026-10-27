import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../icons/Icon';
import { Logo } from '../common/Logo';

// -------------------------------------------------------------
// SECTION 01 / ARCHITECTURE: Why Top Talent Chooses JobDheko
// -------------------------------------------------------------
export const WhySection = () => {
  const whyItems = [
    {
      icon: 'search',
      title: 'Smart Search\n& Matching',
      description: 'AI-driven skill matching that surfaces roles aligned with your verified experience and career goals.',
      metaIcon: 'settings',
      metaLabel: 'Vector Match Engine',
    },
    {
      icon: 'mouse-pointer',
      title: '1-Click Direct\nApplications',
      description: 'Apply directly to verified opportunities with your optimized JobDheko profile.',
      metaIcon: 'zap',
      metaLabel: 'Zero Intermediary',
    },
    {
      icon: 'trending-up',
      title: 'Real-Time Application\nTracking',
      description: 'Track your hiring journey from application review to interview scheduling.',
      metaIcon: 'clock',
      metaLabel: 'Full Status Visibility',
    },
  ];

  return (
    <section
      id="about"
      className="landing-content-section landing-anchor"
      style={{
        backgroundColor: '#070C0A',
        borderBottom: '1px solid #142019',
      }}
    >
      <div className="container">
        {/* Header Tag and Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#A3E635',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            03 / ARCHITECTURE
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Why Top Talent Chooses JobDheko
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div
          className="landing-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {whyItems.map((item) => (
            <div
              key={item.metaLabel}
              className="card-hover"
              style={{
                backgroundColor: '#0C1310',
                border: '1px solid #18261E',
                borderRadius: '16px',
                padding: '1.5rem 15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '270px',
                transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
              }}
            >
              <div>
                {/* Top Icon Box */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(163, 230, 53, 0.25)',
                    color: '#A3E635',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon name={item.icon} size={22} color="#A3E635" />
                </div>

                {/* Card Title */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    whiteSpace: 'pre-line',
                    margin: '0 0 0.75rem 0',
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#8E9B95',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Bottom Meta Pill & Arrow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.75rem',
                  paddingTop: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A3E635', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <Icon name={item.metaIcon} size={16} color="#A3E635" />
                  <span style={{ color: '#E2E8F0' }}>{item.metaLabel}</span>
                </div>
                <Icon name="arrow-right" size={16} color="#8E9B95" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SECTION 02 / TAXONOMY: Explore by Engineering Domain
// -------------------------------------------------------------
export const CategoriesSection = () => {
  const navigate = useNavigate();

  const categories = [
    { icon: 'code', title: 'Software Engineering', count: '4,210+ open positions' },
    { icon: 'brain', title: 'AI / ML', count: '1,640+ open positions' },
    { icon: 'database', title: 'Data Analytics', count: '2,150+ open positions' },
    { icon: 'mobile', title: 'Frontend & Mobile', count: '3,400+ open positions' },
    { icon: 'cloud', title: 'Cloud / DevOps', count: '1,620+ open positions' },
    { icon: 'palette', title: 'Product & Design', count: '980+ open positions' },
  ];

  return (
    <section
      id="taxonomy"
      className="landing-content-section landing-anchor"
      style={{
        backgroundColor: '#070C0A',
        borderBottom: '1px solid #142019',
      }}
    >
      <div className="container">
        {/* Header Tag, Title & Browse All Link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#A3E635',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            02 / TAXONOMY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Explore by Engineering Domain
            </h2>
            <Link
              to="/app/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#A3E635',
                textDecoration: 'none',
              }}
            >
              <span>Browse All</span>
              <Icon name="arrow-right" size={15} color="#A3E635" />
            </Link>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div
          className="landing-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="card-hover"
              onClick={() => navigate(`/app/jobs?q=${encodeURIComponent(cat.title)}`)}
              style={{
                backgroundColor: '#0C1310',
                border: '1px solid #18261E',
                borderRadius: '12px',
                padding: '1rem 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: '#A3E635', display: 'flex', alignItems: 'center' }}>
                  <Icon name={cat.icon} size={22} color="#A3E635" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {cat.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#8E9B95', margin: '0.2rem 0 0' }}>
                    {cat.count}
                  </p>
                </div>
              </div>

              <Icon name="chevron-right" size={16} color="#6B7280" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SECTION 03 / VERIFIED FEEDS: Featured Opportunities
// -------------------------------------------------------------
export const FeaturedSection = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const featuredOpportunities = [
    {
      id: 'job-1',
      title: 'Software Engineer III',
      company: 'Google',
      location: 'Hyderabad',
      salary: '₹28-45 LPA',
      match: '96% Match',
      tags: ['React', 'Go', 'Kubernetes', 'gRPC'],
      logoType: 'google',
    },
    {
      id: 'job-2',
      title: 'AI/ML Research Engineer',
      company: 'Microsoft',
      location: 'Bangalore',
      salary: '₹32-52 LPA',
      match: '92% Match',
      tags: ['Python', 'PyTorch', 'Azure ML'],
      logoType: 'microsoft',
    },
    {
      id: 'job-3',
      title: 'Senior Frontend Engineer',
      company: 'Amazon',
      location: 'Hyderabad',
      salary: '₹26-42 LPA',
      match: '94% Match',
      tags: ['TypeScript', 'Next.js', 'AWS', 'GraphQL'],
      logoType: 'amazon',
    },
  ];

  return (
    <section
      id="jobs"
      className="landing-content-section landing-anchor"
      style={{
        backgroundColor: '#070C0A',
        borderBottom: '1px solid #142019',
      }}
    >
      <div className="container">
        {/* Header Tag, Title & View All Link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#A3E635',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            01 / VERIFIED FEEDS
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Featured Opportunities
            </h2>
            <Link
              to="/app/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#A3E635',
                textDecoration: 'none',
              }}
            >
              <span>View All 12,400+ Jobs</span>
              <Icon name="arrow-right" size={15} color="#A3E635" />
            </Link>
          </div>
        </div>

        {/* 3 Featured Job Cards */}
        <div
          className="landing-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featuredOpportunities.map((job) => (
            <div
              key={job.id}
              className="card-hover"
              style={{
                backgroundColor: '#0C1310',
                border: '1px solid #18261E',
                borderRadius: '16px',
                padding: '1.25rem 15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Top Row: Logo + Match Badge + Bookmark */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      backgroundColor: '#121A16',
                      border: '1px solid #1E2B23',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={job.logoType} size={24} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(163, 230, 53, 0.35)',
                        color: '#A3E635',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {job.match}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(job.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: bookmarks[job.id] ? '#A3E635' : '#6B7280',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                      }}
                      aria-label="Bookmark job"
                    >
                      <Icon name={bookmarks[job.id] ? 'bookmark-filled' : 'bookmark'} size={18} />
                    </button>
                  </div>
                </div>

                {/* Job Title */}
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginTop: '1.15rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  {job.title}
                </h3>

                {/* Meta details */}
                <div style={{ fontSize: '0.8125rem', color: '#8E9B95', marginBottom: '1.25rem' }}>
                  {job.company} • {job.location} • {job.salary}
                </div>

                {/* Skill Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: '#111A16',
                        border: '1px solid #1E2A22',
                        color: '#CBD5E1',
                        fontSize: '0.72rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Heart Favorite + Apply Now Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #142019',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFavorite(job.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: favorites[job.id] ? '#EF4444' : '#8E9B95',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color var(--transition-fast)',
                  }}
                  aria-label="Favorite job"
                >
                  <Icon name="heart" size={18} fill={favorites[job.id] ? '#EF4444' : 'none'} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/app/jobs')}
                  style={{
                    backgroundColor: '#A3E635',
                    color: '#0A0F0D',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 16px rgba(163, 230, 53, 0.25)',
                    transition: 'filter var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                >
                  <span>Apply Now</span>
                  <Icon name="arrow-right" size={14} color="#0A0F0D" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SECTION 04 / CTA BANNER: Ready to Take Your Career...
// -------------------------------------------------------------
export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-cta-section" style={{ backgroundColor: '#070C0A' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid #1B2921',
            backgroundColor: '#09110E',
            textAlign: 'center',
          }}
          className="landing-cta-panel"
        >
          {/* Ambient Curved Swoosh Left */}
          <div
            className="orb-animate-left"
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-100px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(163, 230, 53, 0.08) 45%, transparent 70%)',
              filter: 'blur(65px)',
              pointerEvents: 'none',
            }}
          />

          {/* Ambient Curved Swoosh Right */}
          <div
            className="orb-animate-right"
            style={{
              position: 'absolute',
              bottom: '-120px',
              right: '-100px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(163, 230, 53, 0.06) 45%, transparent 70%)',
              filter: 'blur(65px)',
              pointerEvents: 'none',
            }}
          />

          {/* Centered Content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem 0',
              }}
            >
              Ready to Take Your Career <br />
              to the Next Level?
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#8E9B95',
                lineHeight: 1.6,
                margin: '0 auto 2.25rem',
                maxWidth: '560px',
              }}
            >
              Upload your resume, improve your job profile, and discover <br />
              opportunities matched to your career goals.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/signup')}
                style={{
                  backgroundColor: '#A3E635',
                  color: '#0A0F0D',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  padding: '0.8rem 1.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 20px rgba(163, 230, 53, 0.35)',
                  transition: 'filter var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
              >
                <span>Get Started Free</span>
                <Icon name="arrow-right" size={16} color="#0A0F0D" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/companies')}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #233329',
                  color: '#FFFFFF',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  padding: '0.8rem 1.8rem',
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
                Explore Companies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SECTION 05 / FOOTER: JobDheko Footer
// -------------------------------------------------------------
export const LandingFooter = () => {
  return (
    <footer className="landing-footer" style={{ backgroundColor: '#050807', borderTop: '1px solid #142019' }}>
      <div className="container">
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
          }}
          className="landing-footer-grid"
        >
          {/* Col 1: Brand Logo & Tagline & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Logo to="/" width={108} height={36} scaleY={1} />
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0, fontWeight: 500 }}>
              Find Jobs. Build Careers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '0.5rem' }}>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#6B7280', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <Icon name="linkedin" size={17} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                style={{ color: '#6B7280', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <Icon name="x" size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#6B7280', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <Icon name="instagram" size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{ color: '#6B7280', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <Icon name="youtube" size={17} />
              </a>
            </div>
          </div>

          {/* Col 2: Candidates */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 1.25rem 0' }}>
              Candidates
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <Link to="/app/jobs" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Explore Jobs
              </Link>
              <Link to="/app/companies" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Top Companies
              </Link>
              <Link to="/app/career-resources" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Career Resources
              </Link>
            </div>
          </div>

          {/* Col 3: Companies */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 1.25rem 0' }}>
              Companies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <Link to="/signin" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Post a Job
              </Link>
              <a href="#about" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Talent Suite
              </a>
              <a href="#about" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Pricing
              </a>
            </div>
          </div>

          {/* Col 4: Resources & Legal */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 1.25rem 0' }}>
              Resources & Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <Link to="/app/career-resources" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Guides & Intel
              </Link>
              <a href="#about" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Privacy Policy
              </a>
              <a href="#about" style={{ color: '#8E9B95', textDecoration: 'none' }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div
          style={{
            borderTop: '1px solid #142019',
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#6B7280',
          }}
        >
          <div>© 2025 JobDheko Technologies Inc. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#about" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <span style={{ color: '#27342D' }}>|</span>
            <a href="#about" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Terms of Service
            </a>
            <span style={{ color: '#27342D' }}>|</span>
            <a href="#about" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
