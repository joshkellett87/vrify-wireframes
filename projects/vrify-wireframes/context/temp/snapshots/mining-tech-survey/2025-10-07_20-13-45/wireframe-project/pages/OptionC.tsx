import { WireframeHeader } from "../components/MiningTechHeader";
import { HeroSection } from "../components/HeroSection";
import { ReportOverviewSection } from "../components/ReportOverviewSection";
import { KeyFindingsSection } from "../components/KeyFindingsSection";
import { MethodologySection } from "../components/MethodologySection";
import { FormSection } from "../components/FormSection";
import { RelatedResourcesSection } from "../components/RelatedResourcesSection";
import { WireframeFooter } from "../components/MiningTechFooter";
import { MethodologySnapshotStrip } from "../components/MethodologySnapshotStrip";
import { PageAnchorNav } from "../components/PageAnchorNav";
import { FAQSection } from "../components/FAQSection";

const OptionC = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />
      
      {/* Option C: Trust-forward emphasis - Methodology preview re-positioned */}
      <HeroSection />
      <PageAnchorNav />
      <ReportOverviewSection />
      <KeyFindingsSection />
      <MethodologySnapshotStrip />
      <MethodologySection variant="elevated" />
      <FAQSection />
      <FormSection />
      <RelatedResourcesSection />
      <WireframeFooter />
    </div>
  );
};

export default OptionC;
