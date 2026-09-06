'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveScheduleSimulator } from '@/components/landing/InteractiveScheduleSimulator';
import { FeatureDeepDives } from '@/components/landing/FeatureDeepDives';
import { ProductTourTabs } from '@/components/landing/ProductTourTabs';
import { InteractiveGpaCalculator } from '@/components/landing/InteractiveGpaCalculator';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingTiersSection } from '@/components/landing/PricingTiersSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      {/* 1. Glassmorphic Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section with Live Dynamic Rescheduling Simulation */}
      <HeroSection />

      {/* 3. Interactive AI Schedule Simulator */}
      <InteractiveScheduleSimulator />

      {/* 4. Cognitive Science & 5 Feature Pillars (with Live Socratic AI Chat) */}
      <FeatureDeepDives />

      {/* 5. Interactive Product Tour Tabs */}
      <ProductTourTabs />

      {/* 6. Interactive GPA & Study Time ROI Calculator */}
      <InteractiveGpaCalculator />

      {/* 7. Competitive Comparison Matrix */}
      <ComparisonSection />

      {/* 8. Student Testimonials & University Stories */}
      <TestimonialsSection />

      {/* 9. 100% Free Open Access Pricing Tiers */}
      <PricingTiersSection />

      {/* 10. Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 11. Footer with Quick Links & PWA Installer */}
      <LandingFooter />
    </div>
  );
}
