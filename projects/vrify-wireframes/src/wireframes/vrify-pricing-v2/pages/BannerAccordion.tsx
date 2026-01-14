import { WireframeHeader } from "@/shared/components/WireframeHeader";
import { PricingHero } from "../components/pricing/PricingHero";
import { ProductCard } from "../components/pricing/ProductCard";
import { AccordionProductSection } from "../components/pricing/AccordionProductSection";
import { FoundationBand } from "../components/pricing/FoundationBand";
import { LogoRow, HowItWorks, FAQ, Testimonial, FinalCTA } from "../components/sections/SharedSections";

const navItems = [
  { to: "/vrify-pricing-v2/banner-expanded", label: "A1", end: false },
  { to: "/vrify-pricing-v2/banner-accordion", label: "A2", end: false },
  { to: "/vrify-pricing-v2/foundation-expanded", label: "B1", end: false },
  { to: "/vrify-pricing-v2/foundation-accordion", label: "B2", end: false },
];

/**
 * Variant A2: Banner Accordion
 * - Data Uploader as foundation banner
 * - VRIFY Predict with collapsible accordion modules (saves vertical space)
 * - VRIFY Present stacked below
 * 
 * Hypothesis: Banner foundation + accordion modules creates dense layout
 * while allowing users to expand details on demand.
 */
const BannerAccordion = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing-v2"
        projectTitle="Pricing V2"
        navItems={navItems}
      />

      {/* Hero */}
      <PricingHero />

      {/* Data Uploader - Banner Style */}
      <FoundationBand
        title="VRIFY Data Uploader"
        description="Foundational to VRIFY's Exploration Intelligence Platform. Import diverse data types and formats into a single workspace where data can be cleaned, standardized, and unified."
        features={[
          "Import diverse data types and formats",
          "Clean and standardize data automatically",
          "Unify for use across all platform products"
        ]}
        showCta={true}
        ctaText="Learn More"
      />

      {/* Products - Stacked Vertical */}
      <section id="products" className="py-8">
        <div className="container mx-auto px-4 space-y-4">
          {/* VRIFY Predict with accordion modules */}
          <ProductCard
            productName="VRIFY Predict"
            description="Exploration intelligence for mineral discovery. Leverages AI-assisted analysis to help explorers identify prospective targets and make data-driven decisions."
            specifications={[
              { label: "Analysis Type", value: "AI-assisted prospectivity" },
              { label: "Data Integration", value: "Multi-source fusion" },
              { label: "Output", value: "Ranked target maps" },
              { label: "Coverage", value: "Regional to deposit-scale" },
              { label: "Training Data", value: "Global deposit database" },
              { label: "Model Type", value: "Ensemble ML + domain rules" },
            ]}
            notes={["All modules require VRIFY Data Uploader for data ingestion."]}
            variant="stacked"
            ctaText="Book a Demo"
          >
            <AccordionProductSection
              products={[
                {
                  name: "DORA",
                  description: "AI-Assisted Prospectivity Mapping",
                  groupedFeatures: [
                    {
                      title: "Core Analysis",
                      items: [
                        "Multi-layer data integration from diverse sources",
                        "Machine learning-based target ranking",
                        "Customizable weighting parameters",
                        "Historical validation analytics"
                      ]
                    },
                    {
                      title: "Output & Integration",
                      items: [
                        "Export to common GIS formats",
                        "Uncertainty quantification",
                        "Batch processing for regional analysis",
                        "Integration with VRIFY Present"
                      ]
                    }
                  ]
                },
                {
                  name: "Cousteau",
                  description: "Deep exploration analytics for subsurface characterization",
                  groupedFeatures: [
                    {
                      title: "Data Management",
                      items: [
                        "Drillhole data integration and management",
                        "3D geological modeling visualization",
                        "Core logging data integration",
                        "Lithological contact modeling"
                      ]
                    },
                    {
                      title: "Analysis Tools",
                      items: [
                        "Structural analysis and fault interpretation",
                        "Cross-section and plan view generation",
                        "Resource estimation input preparation",
                        "Depth-to-basement modeling"
                      ]
                    }
                  ]
                },
                {
                  name: "Data Augmentation",
                  description: "Enhance sparse datasets with AI-derived synthetic data",
                  groupedFeatures: [
                    {
                      title: "Gap Analysis",
                      items: [
                        "Intelligent gap identification algorithms",
                        "Coverage optimization recommendations",
                        "Data density heat mapping"
                      ]
                    },
                    {
                      title: "Augmentation Methods",
                      items: [
                        "Geologically-constrained interpolation",
                        "Uncertainty-aware augmentation methods",
                        "Quality scoring and validation metrics"
                      ]
                    }
                  ]
                }
              ]}
            />
          </ProductCard>

          {/* VRIFY Present */}
          <ProductCard
            productName="VRIFY Present"
            description="Multidimensional communication for exploration and mining. Create immersive 3D presentations that bring your geological data to life for stakeholders."
            groupedInclusions={[
              {
                title: "Presentation Features",
                items: [
                  "Interactive 3D visualization",
                  "Drillhole and assay display",
                  "Cross-section views",
                  "Annotation tools"
                ]
              },
              {
                title: "Sharing & Collaboration",
                items: [
                  "Secure shareable links",
                  "Embedded presentations",
                  "Team collaboration",
                  "Version control"
                ]
              }
            ]}
            specifications={[
              { label: "Presentation Types", value: "3D Interactive" },
              { label: "Export Formats", value: "Web, PDF, Video" },
              { label: "Collaboration", value: "Team-based" },
              { label: "Model Support", value: "Block models, surfaces" },
              { label: "Data Sources", value: "Drillholes, assays, geology" },
              { label: "Access Control", value: "Role-based permissions" },
            ]}
            variant="stacked"
            ctaText="Book a Demo"
          />
        </div>
      </section>

      {/* Shared Sections */}
      <LogoRow />
      <HowItWorks />
      <FAQ />
      <Testimonial />
      <FinalCTA />
    </div>
  );
};

export default BannerAccordion;
