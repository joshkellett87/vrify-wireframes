import { WireframeHeader } from "../components/MiningTechHeader";
import { HeroSection } from "../components/HeroSection";
import { ReportOverviewSection } from "../components/ReportOverviewSection";
import { KeyFindingsSection } from "../components/KeyFindingsSection";
import { MethodologySection } from "../components/MethodologySection";
import { LeadCaptureFormSection } from "../components/LeadCaptureFormSection";
import { RelatedResourcesSection } from "../components/RelatedResourcesSection";
import { WireframeFooter } from "../components/MiningTechFooter";
import { PageAnchorNav } from "../components/PageAnchorNav";
import { MethodologySnapshotStrip } from "../components/MethodologySnapshotStrip";
import { FAQSection } from "../components/FAQSection";

const OptionA = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />
      
      {/* Option A: Form-forward emphasis - Form preview in hero */}
      <HeroSection variant="form-preview" />
      <PageAnchorNav />
      <ReportOverviewSection />
      <KeyFindingsSection />
      <MethodologySnapshotStrip />
      <MethodologySection />
      <FAQSection />
      <LeadCaptureFormSection />
      <RelatedResourcesSection />
      <WireframeFooter />
    </div>
  );
};

export default OptionA;
