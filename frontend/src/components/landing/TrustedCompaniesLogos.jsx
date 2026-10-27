import React from 'react';

const CompanyLogoSet = () => (
    <>
      {/* 1. Google */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85, transition: 'opacity 0.2s' }} title="Google">
        <svg height="24" viewBox="0 0 86 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="'Product Sans', 'Inter', sans-serif" fontSize="22" fontWeight="700" fill="#E2E8F0" letterSpacing="-0.5">
            Google
          </text>
        </svg>
      </div>

      {/* 2. Microsoft */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, opacity: 0.85 }} title="Microsoft">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="0" y="0" width="9.2" height="9.2" fill="#E2E8F0" />
          <rect x="10.8" y="0" width="9.2" height="9.2" fill="#E2E8F0" />
          <rect x="0" y="10.8" width="9.2" height="9.2" fill="#E2E8F0" />
          <rect x="10.8" y="10.8" width="9.2" height="9.2" fill="#E2E8F0" />
        </svg>
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#E2E8F0', letterSpacing: '-0.3px', fontFamily: "'Segoe UI', 'Inter', sans-serif" }}>
          Microsoft
        </span>
      </div>

      {/* 3. amazon */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="Amazon">
        <svg height="22" viewBox="0 0 84 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#E2E8F0" letterSpacing="-0.5">
            amazon
          </text>
          <path d="M12 22C28 27 50 25 66 18" stroke="#E2E8F0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M63 16L67 18L64 21" stroke="#E2E8F0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 4. tcs */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="Tata Consultancy Services">
        <span style={{ fontSize: '22px', fontWeight: 800, color: '#E2E8F0', letterSpacing: '-1px', textTransform: 'lowercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          tcs
        </span>
      </div>

      {/* 5. accenture */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="Accenture">
        <svg height="20" viewBox="0 0 94 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="19" fontFamily="'Inter', sans-serif" fontSize="16" fontWeight="600" fill="#E2E8F0" letterSpacing="-0.4">
            accenture
          </text>
          <path d="M57 4L63 1L60 7" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 6. Infosys */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="Infosys">
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px', fontFamily: "'Inter', serif" }}>
          Infosys
        </span>
      </div>

      {/* 7. wipro */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, opacity: 0.85 }} title="Wipro">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="#E2E8F0" />
          <circle cx="12" cy="5" r="2" fill="#E2E8F0" opacity="0.8" />
          <circle cx="12" cy="19" r="2" fill="#E2E8F0" opacity="0.8" />
          <circle cx="5" cy="12" r="2" fill="#E2E8F0" opacity="0.8" />
          <circle cx="19" cy="12" r="2" fill="#E2E8F0" opacity="0.8" />
          <circle cx="7" cy="7" r="1.5" fill="#A3E635" />
          <circle cx="17" cy="17" r="1.5" fill="#A3E635" />
          <circle cx="7" cy="17" r="1.5" fill="#A3E635" />
          <circle cx="17" cy="7" r="1.5" fill="#A3E635" />
        </svg>
        <span style={{ fontSize: '17px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px', fontFamily: "'Inter', sans-serif" }}>
          wipro
        </span>
      </div>

      {/* 8. IBM */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="IBM">
        <svg height="18" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="'Courier New', monospace" fontSize="22" fontWeight="900" fill="#E2E8F0" letterSpacing="2">
            IBM
          </text>
        </svg>
      </div>

      {/* 9. Deloitte. */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }} title="Deloitte">
        <span style={{ fontSize: '17px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px', fontFamily: "'Inter', sans-serif" }}>
          Deloitte<span style={{ color: '#A3E635' }}>.</span>
        </span>
      </div>

      {/* 10. EY */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0, opacity: 0.85 }} title="EY">
        <svg height="22" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3L28 1" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <text x="2" y="23" fontFamily="'Inter', sans-serif" fontSize="20" fontWeight="900" fill="#E2E8F0" letterSpacing="-1">
            EY
          </text>
        </svg>
      </div>
    </>
);

export const TrustedCompaniesLogos = () => (
  <div className="trusted-companies-marquee">
    <div className="trusted-companies-track">
      <div className="trusted-companies-group">
        <CompanyLogoSet />
      </div>
      <div className="trusted-companies-group trusted-companies-copy" aria-hidden="true">
        <CompanyLogoSet />
      </div>
    </div>
  </div>
);
