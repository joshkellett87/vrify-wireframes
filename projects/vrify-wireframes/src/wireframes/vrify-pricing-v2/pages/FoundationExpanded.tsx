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
 * Variant B1: Foundation Expanded
 * - Data Uploader as foundation band at top
 * - VRIFY Predict and Present as side-by-side cards
 * - Expanded nested module cards within Predict
 * 
 * Hypothesis: Two-column layout enables direct product comparison while
 * foundation band establishes Data Uploader as underlying prerequisite.
 */
const FoundationExpanded = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing-v2"
        projectTitle="Pricing V2"
        navItems={navItems}
      />

      {/* Hero */}
      <PricingHero />

      {/* Foundation Band - Data Uploader */}
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

      {/* Products - Grid Layout (side-by-side) */}
      <section id="products" className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* VRIFY Predict with nested cards */}
            <ProductCard
              productName="VRIFY Predict"
              description="Exploration intelligence for mineral discovery through AI-assisted analysis."
              specifications={[
                { label: "Analysis Type", value: "AI-assisted" },
                { label: "Integration", value: "Multi-source" },
                { label: "Output", value: "Ranked target maps" },
                { label: "Coverage", value: "Regional to deposit-scale" },
                { label: "Training Data", value: "Global deposit database" },
                { label: "Model Type", value: "Ensemble ML + domain rules" },
              ]}
              variant="compact"
              ctaText="Book a Demo"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-semibold font-mono text-wireframe-text uppercase tracking-wide">
                  Included Modules
                </h4>
                <NestedProductCardsGrid columns={1}>
                  <NestedProductCard
                    name="DORA"
                    description="AI-Assisted Prospectivity Mapping"
                    groupedFeatures={[
                      {
                        title: "Core Analysis",
                        items: [
                          "Multi-layer integration",
                          "ML target ranking",
                          "Customizable weighting"
                        ]
                      },
                      {
                        title: "Output & Integration",
                        items: [
                          "GIS export",
                          "Validation analytics",
                          "Uncertainty quantification"
                        ]
                      }
                    ]}
                  />
                  <NestedProductCard
                    name="Cousteau"
                    description="Subsurface characterization"
                    groupedFeatures={[
                      {
                        title: "Data Management",
                        items: [
                          "Drillhole analysis",
                          "3D modeling",
                          "Core logging"
                        ]
                      },
                      {
                        title: "Analysis Tools",
                        items: [
                          "Structural tools",
                          "Cross-section generation",
                          "Resource inputs"
                        ]
                      }
                    ]}
                  />
                  <NestedProductCard
                    name="Data Augmentation"
                    description="AI-derived synthetic data"
                    groupedFeatures={[
                      {
                        title: "Gap Analysis",
                        items: [
                          "Gap identification",
                          "Coverage optimization"
                        ]
                      },
                      {
                        title: "Augmentation",
                        items: [
                          "Constrained interpolation",
                          "Quality scoring"
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
              description="Multidimensional communication for exploration and mining. Create immersive 3D presentations."
              groupedInclusions={[
                {
                  title: "Presentation Features",
                  items: [
                    "Interactive 3D visualization",
                    "Drillhole and assay display",
                    "Cross-section views",
                    "Annotation tools",
                    "Measurement and distance tools",
                    "Custom styling and theming",
                    "Animation and flythrough",
                    "Multi-layer overlay support"
                  ]
                },
                {
                  title: "Sharing & Collaboration",
                  items: [
                    "Secure shareable links",
                    "Embedded presentations",
                    "Team collaboration spaces",
                    "Version control and history",
                    "Comment and annotation layers",
                    "Stakeholder access management",
                    "Download and offline access",
                    "Usage analytics and reporting"
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
              variant="compact"
              ctaText="Book a Demo"
            />
          </div>
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

export default FoundationExpanded;
