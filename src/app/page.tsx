import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import TrustStrip from '@/app/components/TrustStrip';
import ProblemSection from '@/app/components/ProblemSection';
import ProductDemo from '@/app/components/ProductDemo';
import HowItWorks from '@/app/components/HowItWorks';
import FeatureGrid from '@/app/components/FeatureGrid';
import HumanInLoop from '@/app/components/HumanInLoop';
import QuoteIntelligence from '@/app/components/QuoteIntelligence';
import UseCases from '@/app/components/UseCases';
import Testimonials from '@/app/components/Testimonials';
import MetricsSection from '@/app/components/MetricsSection';
import PricingSection from '@/app/components/PricingSection';
import FaqSection from '@/app/components/FaqSection';
import FinalCta from '@/app/components/FinalCta';
import ScrollRevealInit from '@/app/components/ScrollRevealInit';
import StructuredData from '@/app/components/StructuredData';

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <ScrollRevealInit />
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <ProductDemo />
        <HowItWorks />
        <FeatureGrid />
        <HumanInLoop />
        <QuoteIntelligence />
        <UseCases />
        <Testimonials />
        <MetricsSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}