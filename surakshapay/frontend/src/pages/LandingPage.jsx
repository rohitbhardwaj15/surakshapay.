import React from 'react';
import {
  LandingNav, HeroSection, StatsBar, FeaturesSection,
  HowItWorksSection, TestimonialsSection, FAQSection,
  CTASection, LandingFooter,
} from '../components/landing/index.jsx';

export default function LandingPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
