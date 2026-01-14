import { PricingHero } from "../components/pricing/PricingHero";
import { PricingCard } from "../components/pricing/PricingCard";
import { SocialProofSection, FAQSection, FinalCTASection } from "../components/wireframe/SharedSections";
import { WireframeHeader } from "@/shared/components/WireframeHeader";

const HowItWorksA = () => (
  <section className="py-8">
    <div className="container mx-auto px-4 max-w-[1400px]">
      <h2 className="text-3xl font-bold font-mono text-center mb-8">How It Works</h2>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {[
            { title: "Book a Demo", desc: "Reach out for initial consultation" },
            { title: "Solution Design", desc: "Custom configuration and proposal" },
            { title: "Onboarding & Integration", desc: "Implementation, setup, and user training" },
            { title: "Launch & Support", desc: "Go live with dedicated success management" },
          ].map((step, i) => (
            <div key={i} className="flex items-start space-x-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold rounded-full">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold font-mono mb-2">{step.title}</h3>
                <p className="text-wireframe-text font-mono text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PricingA = () => {
  const doraGroupedInclusions = [
    {
      title: "Core Metrics",
      items: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor incididunt",
        "Ut labore et dolore magna"
      ]
    },
    {
      title: "Advanced Features",
      items: [
        "Magna aliqua enim ad minim",
        "Veniam quis nostrud exercitation",
        "Ullamco laboris nisi ut aliquip",
        "Ex ea commodo consequat"
      ]
    }
  ];

  const doraSpecifications = [
    { label: "Data Sources", value: "Lorem ipsum dolor" },
    { label: "Update Frequency", value: "Consectetur adipiscing" },
    { label: "Dashboard Views", value: "Sed do eiusmod" },
    { label: "Export Formats", value: "Ut labore et dolore" },
    { label: "Integrations", value: "Magna aliqua enim" }
  ];

  const doraNotes = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  ];

  const vizGroupedInclusions = [
    {
      title: "Visualization Tools",
      items: [
        "Duis aute irure dolor",
        "In reprehenderit voluptate",
        "Velit esse cillum dolore",
        "Eu fugiat nulla pariatur"
      ]
    },
    {
      title: "Data Management",
      items: [
        "Excepteur sint occaecat",
        "Cupidatat non proident",
        "Sunt in culpa qui officia",
        "Deserunt mollit anim"
      ]
    }
  ];

  const vizSpecifications = [
    { label: "Chart Types", value: "Lorem ipsum dolor" },
    { label: "Data Sources", value: "Consectetur adipiscing" },
    { label: "Refresh Rate", value: "Sed do eiusmod" },
    { label: "Export Options", value: "Ut labore et dolore" },
    { label: "Sharing", value: "Magna aliqua enim" }
  ];

  const vizNotes = [
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae."
  ];

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing"
        projectTitle="Pricing Wireframes"
        navItems={[
          { to: "/vrify-pricing/professional-cards", label: "Wireframe A", end: false },
          { to: "/vrify-pricing/unified-panel", label: "Wireframe B", end: false },
          { to: "/vrify-pricing/cards-foundation", label: "Wireframe C", end: false },
          { to: "/vrify-pricing/components-preview", label: "Components", end: false }
        ]}
      />

      <main>
        <PricingHero />

        {/* Product Plans Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PricingCard
                productName="DORA"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                groupedInclusions={doraGroupedInclusions}
                specifications={doraSpecifications}
                notes={doraNotes}
                variant="professional"
              />
              <PricingCard
                productName="Viz"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                groupedInclusions={vizGroupedInclusions}
                specifications={vizSpecifications}
                notes={vizNotes}
                variant="professional"
              />
            </div>
          </div>
        </section>

        <SocialProofSection />
        <HowItWorksA />
        <FAQSection />
        <FinalCTASection />
      </main>
    </div>
  );
};

export default PricingA;
