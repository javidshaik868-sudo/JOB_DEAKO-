import React from 'react';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { HeroSection } from '../../components/landing/HeroSection';
import {
  FeaturedSection,
  CategoriesSection,
  WhySection,
  CtaSection,
  LandingFooter,
} from '../../components/landing/LandingSections';

export const LandingPage = () => {
  return (
    <div className="landing-page" style={{ backgroundColor: '#070C0A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingNavbar />
      <main style={{ flex: 1 }}>
        {/* 1. Home */}
        <HeroSection />

        {/* 2. Jobs */}
        <FeaturedSection />

        {/* 3. Explore */}
        <CategoriesSection />

        {/* 4. About */}
        <WhySection />

        {/* CTA Banner */}
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
