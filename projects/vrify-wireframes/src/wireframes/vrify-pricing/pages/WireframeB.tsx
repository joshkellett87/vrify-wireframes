import { PricingHero } from "../components/pricing/PricingHero";
import { UnifiedPricingPanel } from "../components/pricing/UnifiedPricingPanel";
import { SocialProofSection, FAQSection, FinalCTASection } from "../components/wireframe/SharedSections";
import { WireframeBox } from "../components/wireframe/WireframeBox";
import { WireframeHeader } from "@/shared/components/WireframeHeader";

const HowItWorksB = () => (
  <section className="py-8">
    <div className="container mx-auto px-4 max-w-[1400px]">
      <h2 className="text-3xl font-bold font-mono text-center mb-8">How It Works</h2>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Book a Demo", desc: "Reach out for initial consultation" },
            { title: "Solution Design", desc: "Custom configuration and proposal" },
            { title: "Onboarding & Integration", desc: "Implementation, setup, and user training" },
            { title: "Launch & Support", desc: "Go live with dedicated success management" },
          ].map((step, i) => (
            <div key={i} className="space-y-4 text-center p-6 border border-wireframe-divider rounded-lg">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold rounded-full mx-auto">
                {i + 1}
              </div>
              <WireframeBox placeholder="[Icon]" height="h-16" />
              <h3 className="text-lg font-semibold font-mono">{step.title}</h3>
              <p className="text-wireframe-text font-mono text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PricingB = () => {
  const productData = [
    {
      name: "DORA",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      inclusions: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Sed do eiusmod tempor incididunt ut labore et dolore",
        "Magna aliqua enim ad minim veniam quis nostrud",
        "Exercitation ullamco laboris nisi ut aliquip ex ea",
        "Commodo consequat duis aute irure dolor in reprehenderit",
        "Voluptate velit esse cillum dolore eu fugiat nulla",
        "Pariatur excepteur sint occaecat cupidatat non proident",
        "Sunt in culpa qui officia deserunt mollit anim"
      ]
    },
    {
      name: "Viz",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      inclusions: [
        "Sed ut perspiciatis unde omnis iste natus error",
        "Sit voluptatem accusantium doloremque laudantium",
        "Totam rem aperiam eaque ipsa quae ab illo",
        "Inventore veritatis et quasi architecto beatae",
        "Vitae dicta sunt explicabo nemo enim ipsam",
        "Voluptatem quia voluptas sit aspernatur aut odit",
        "Aut fugit sed quia consequuntur magni dolores",
        "Eos qui ratione voluptatem sequi nesciunt"
      ]
    }
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
            <UnifiedPricingPanel
              products={productData as [typeof productData[0], typeof productData[1]]}
            />
          </div>
        </section>

        <SocialProofSection />
        <HowItWorksB />
        <FAQSection />
        <FinalCTASection />
      </main>
    </div>
  );
};

export default PricingB;
