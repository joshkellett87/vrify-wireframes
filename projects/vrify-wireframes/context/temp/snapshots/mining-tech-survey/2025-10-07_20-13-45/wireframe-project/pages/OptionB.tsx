import { WireframeHeader } from "../components/MiningTechHeader";
import { HeroSection } from "../components/HeroSection";
import { ReportOverviewSection } from "../components/ReportOverviewSection";
import { KeyFindingsSection } from "../components/KeyFindingsSection";
import { MethodologySection } from "../components/MethodologySection";
import { FormSection } from "../components/FormSection";
import { RelatedResourcesSection } from "../components/RelatedResourcesSection";
import { WireframeFooter } from "../components/MiningTechFooter";
import { PageAnchorNav } from "../components/PageAnchorNav";
import { MethodologySnapshotStrip } from "../components/MethodologySnapshotStrip";
import { FAQSection } from "../components/FAQSection";

const OptionB = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />
      
      {/* Option B: Highlights-forward emphasis - Inline hero form + snapshot moved below */}
      <HeroSection variant="form-inline" />
      <PageAnchorNav />
      <ReportOverviewSection />
      <KeyFindingsSection variant="elevated" />
      <MethodologySnapshotStrip />
      <MethodologySection />
      <FAQSection />
      <FormSection />
      <RelatedResourcesSection />
      <WireframeFooter />
    </div>
  );
};

export default OptionB;
