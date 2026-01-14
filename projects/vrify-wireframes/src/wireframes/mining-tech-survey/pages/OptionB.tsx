import { WireframeHeader } from "../components/MiningTechHeader";
import { HeroSection } from "../components/HeroSection";
import { ReportOverviewSection } from "../components/ReportOverviewSection";
import { KeyFindingsSection } from "../components/KeyFindingsSection";
import { MethodologySection } from "../components/MethodologySection";
import { RelatedResourcesSection } from "../components/RelatedResourcesSection";
import { WireframeFooter } from "../components/MiningTechFooter";
import { PageAnchorNav } from "../components/PageAnchorNav";
import { MethodologySnapshotStrip } from "../components/MethodologySnapshotStrip";
import { FAQSection } from "../components/FAQSection";
import { StickyFormSidebar } from "../components/StickyFormSidebar";
import { LeadCaptureFormSection } from "../components/LeadCaptureFormSection";

const OptionB = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />

      {/* Option B: Highlights-forward emphasis - Clean hero + sticky sidebar form */}
      <HeroSection variant="sticky-sidebar" />
      <PageAnchorNav />

      {/* Two-column layout: Main content (8 cols) + Sticky form sidebar (4 cols) */}
      <div className="wireframe-container pb-16">
        <div className="wireframe-grid">
          {/* Main content area */}
          <div className="col-span-12 lg:col-span-8">
            <ReportOverviewSection layout="narrow" />
            <KeyFindingsSection variant="elevated" layout="narrow" />
            <MethodologySnapshotStrip />
            <MethodologySection />
          </div>

          {/* Sticky sidebar - only visible on lg+ screens */}
          <div className="hidden lg:block lg:col-span-4">
            <StickyFormSidebar />
          </div>
        </div>
      </div>

      {/* Full-width FAQ Section */}
      <FAQSection />

      {/* Full-width Lead Capture Form - positioned after FAQ, before Related Resources */}
      <LeadCaptureFormSection />

      {/* Full-width Related Resources */}
      <RelatedResourcesSection />

      <WireframeFooter />
    </div>
  );
};

export default OptionB;
