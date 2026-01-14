import { WireframeHeader } from "@/shared/components/WireframeHeader";
import { PricingHero } from "../components/pricing/PricingHero";
import { ProductCard } from "../components/pricing/ProductCard";
import { NestedProductCard, NestedProductCardsGrid } from "../components/pricing/NestedProductCard";
import { FoundationBand } from "../components/pricing/FoundationBand";
import { LogoRow, HowItWorks, FAQ, Testimonial, FinalCTA } from "../components/sections/SharedSections";

const navItems = [
  { to: "/vrify-pricing-v2/banner-expanded", label: "A1", end: false },
  { to: "/vrify-pricing-v2/banner-accordion", label: "A2", end: false },
  { to: "/vrify-pricing-v2/foundation-expanded", label: "B1", end: false },
  { to: "/vrify-pricing-v2/foundation-accordion", label: "B2", end: false },
];

/**
 * Variant A1: Banner Expanded
 * - Data Uploader as foundation banner
 * - VRIFY Predict with expanded nested module cards
 * - VRIFY Present stacked below
 * 
 * Hypothesis: Banner treatment positions Data Uploader as foundational prereq,
 * while expanded nested cards give modules adequate space for detail.
 */
const BannerExpanded = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing-v2"
        projectTitle="Pricing V2"
        navItems={navItems}
      />

      {/* Hero */}
      <PricingHero />

      {/* Data Uploader - Banner Style (like mockup) */}
      <FoundationBand
        title="VRIFY Data Uploader"
        description="Foundational to VRIFY's Exploration Intelligence Software. The VRIFY Data Uploader enables explorers and miners to import diverse data types and formats into a single workspace, where the data can be cleaned, standardized, and unified."
        features={[
          "Import diverse data types and formats",
          "Clean and standardize data automatically",
          "Unify for use across VRIFY Predict and VRIFY Present"
        ]}
        showCta={true}
        ctaText="Learn More"
      />

      {/* Products - Stacked Vertical */}
      <section id="products" className="py-8">
        <div className="container mx-auto px-4 space-y-6">
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
            notes={[
              "All modules require VRIFY Data Uploader for data ingestion.",
              "Training data is continuously updated with new deposit discoveries worldwide.",
              "Custom model training available for enterprise customers with proprietary data.",
              "Dedicated onboarding support included with all subscription tiers."
            ]}
            variant="stacked"
            ctaText="Book a Demo"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-semibold font-mono text-wireframe-text uppercase tracking-wide">
                Included Modules
              </h4>
              <NestedProductCardsGrid columns={1}>
                <NestedProductCard
                  name="DORA"
                  description="AI-Assisted Prospectivity Mapping. DORA analyzes geological, geochemical, and geophysical data to generate prospectivity maps highlighting areas with high mineral potential."
                  groupedFeatures={[
                    {
                      title: "Core Analysis",
                      items: [
                        "Multi-layer data integration",
                        "Machine learning-based target ranking",
                        "Customizable weighting parameters"
                      ]
                    },
                    {
                      title: "Output & Integration",
                      items: [
                        "Export to GIS formats",
                        "Historical validation analytics",
                        "Uncertainty quantification"
                      ]
                    }
                  ]}
                />
                <NestedProductCard
                  name="Cousteau"
                  description="Deep exploration analytics for subsurface characterization. Cousteau specializes in analyzing drill data and geological models to refine targeting strategies."
                  groupedFeatures={[
                    {
                      title: "Data Management",
                      items: [
                        "Drillhole data integration",
                        "3D geological modeling support",
                        "Core logging integration"
                      ]
                    },
                    {
                      title: "Analysis Tools",
                      items: [
                        "Structural analysis tools",
                        "Cross-section generation",
                        "Resource estimation inputs"
                      ]
                    }
                  ]}
                />
                <NestedProductCard
                  name="Data Augmentation"
                  description="Enhance sparse datasets with AI-derived synthetic data. Fill gaps in exploration coverage while maintaining geological validity."
                  groupedFeatures={[
                    {
                      title: "Gap Analysis",
                      items: [
                        "Gap identification algorithms",
                        "Coverage optimization",
                        "Data density mapping"
                      ]
                    },
                    {
                      title: "Augmentation Methods",
                      items: [
                        "Geologically-constrained interpolation",
                        "Uncertainty-aware augmentation",
                        "Quality scoring metrics"
                      ]
                    }
                  ]}
                />
              </NestedProductCardsGrid>
            </div>
          </ProductCard>

          {/* VRIFY Present */}
          <ProductCard
            productName="VRIFY Present"
            description="Multidimensional communication for exploration and mining. Create immersive 3D presentations that bring your geological data to life for stakeholders."
            groupedInclusions={[
              {
                title: "Presentation Features",
                items: [
                  "Interactive 3D data visualization",
                  "Drillhole and assay display",
                  "Cross-section and plan views",
                  "Annotation and markup tools"
                ]
              },
              {
                title: "Sharing & Collaboration",
                items: [
                  "Secure shareable links",
                  "Embedded presentations",
                  "Team collaboration spaces",
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

export default BannerExpanded;
