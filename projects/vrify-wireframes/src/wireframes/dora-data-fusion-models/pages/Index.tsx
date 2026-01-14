import React from "react";
import { WireframeHeader } from "@wireframe/core";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { DiscoverStrip } from "../components/DiscoverStrip";
import { CaseStudySection } from "../components/CaseStudySection";
import { BenefitsSection } from "../components/BenefitsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { PrimaryCTASection } from "../components/PrimaryCTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a1107]">
      <WireframeHeader
        basePath="/dora-data-fusion-models"
        projectTitle="DORA Platform"
      />
      <main className="flex flex-col">
        <HeroSection />
        <HowItWorksSection />
        <DiscoverStrip />
        <CaseStudySection />
        <BenefitsSection />
        <TestimonialsSection />
        <PrimaryCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
