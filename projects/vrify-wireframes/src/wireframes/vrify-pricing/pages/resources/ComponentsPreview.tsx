import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PricingCard } from "../../components/pricing/PricingCard";
import { PricingHero } from "../../components/pricing/PricingHero";
import { UnifiedPricingPanel } from "../../components/pricing/UnifiedPricingPanel";
import { SocialProofSection, FAQSection, FinalCTASection } from "../../components/wireframe/SharedSections";
import { WireframeBox } from "../../components/wireframe/WireframeBox";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import metadata from "../../metadata.json";

// How It Works variations from each wireframe - actual implementations
const HowItWorksA = () => (
  <section id="how-it-works-a" className="py-8">
    <div className="container mx-auto px-4 max-w-[1400px]">
      <h3 className="text-2xl font-bold font-mono mb-8">How It Works - Version A (Vertical Steps)</h3>
      <p className="text-muted-foreground mb-8">Used in: Wireframe A - Vertical step-by-step layout</p>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold rounded-full">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold font-mono mb-2">Step {i + 1}</h4>
                <p className="text-wireframe-text font-mono text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksB = () => (
  <section id="how-it-works-b" className="py-8">
    <div className="container mx-auto px-4 max-w-[1400px]">
      <h3 className="text-2xl font-bold font-mono mb-8">How It Works - Version B (Horizontal Timeline)</h3>
      <p className="text-muted-foreground mb-8">Not used in wireframes - Horizontal timeline with connected steps</p>
      <div className="max-w-6xl mx-auto">
        {/* Horizontal Timeline */}
        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col items-center relative">
                <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-lg rounded-full">
                  {i + 1}
                </div>
                <h4 className="mt-4 font-semibold font-mono text-center">Step {i + 1}</h4>
                {i < 3 && (
                  <div
                    className="absolute left-full top-8 w-full h-0.5 bg-wireframe-divider -translate-y-1/2 hidden lg:block"
                    style={{ width: 'calc(100vw / 4 - 4rem)' }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Text blocks beneath nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 text-center">
                <p className="text-sm font-mono text-wireframe-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
                <WireframeBox placeholder="[Icon]" height="h-16" className="w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksC = () => (
  <section id="how-it-works-c" className="py-8">
    <div className="container mx-auto px-4 max-w-[1400px]">
      <h3 className="text-2xl font-bold font-mono mb-8">How It Works - Version C (2x2 Grid)</h3>
      <p className="text-muted-foreground mb-8">Used in: Wireframe B - 2x2 bordered grid layout</p>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-4 text-center p-6 border border-wireframe-divider rounded-lg">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold rounded-full mx-auto">
                {i + 1}
              </div>
              <WireframeBox placeholder="[Icon]" height="h-16" />
              <h4 className="text-lg font-semibold font-mono">Step {i + 1}</h4>
              <p className="text-wireframe-text font-mono text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ComponentsPreview = () => {
  const [activeSection, setActiveSection] = useState("");
  const project = metadata as { slug: string; variants?: Record<string, { label?: string; name?: string }> };
  const toVariantLabel = (index: number) => `Wireframe ${String.fromCharCode("A".charCodeAt(0) + index)}`;
  const variantNavLinks =
    Object.entries(project.variants ?? {}).map(([slug, variant], index) => ({
      href: `/${project.slug}/${slug}`,
      label: variant.label ?? variant.name ?? toVariantLabel(index),
    }));

  const sections = [
    { id: "hero", label: "Pricing Hero" },
    { id: "pricing-cards", label: "Pricing Cards" },
    { id: "unified-panel", label: "Unified Panel" },
    { id: "social-proof", label: "Social Proof" },
    { id: "how-it-works-a", label: "HIW - Version A" },
    { id: "how-it-works-b", label: "HIW - Version B" },
    { id: "how-it-works-c", label: "HIW - Version C" },
    { id: "faq", label: "FAQ" },
    { id: "final-cta", label: "Final CTA" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold font-mono">Components Library</h1>
            <nav className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/vrify-pricing">Home</Link>
              </Button>
              {variantNavLinks.map(({ href, label }) => (
                <Button key={href} variant="ghost" asChild>
                  <Link to={href}>{label}</Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {sections.map(({ id, label }) => (
              <Button
                key={id}
                variant={activeSection === id ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection(id)}
                className="whitespace-nowrap"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {/* Pricing Hero */}
        <section id="hero" className="py-8">
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold font-mono mb-4">Pricing Hero</h2>
            <p className="text-muted-foreground mb-4">Used in: All wireframes (A, B, C)</p>
          </div>
          <PricingHero />
        </section>

        <Separator className="my-8" />

        {/* Pricing Cards */}
        <section id="pricing-cards" className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-mono mb-4">Pricing Cards</h2>
            <p className="text-muted-foreground mb-4">Different card configurations used across wireframes</p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-mono mb-4">Wireframe A - Professional Cards</h3>
                <p className="text-muted-foreground mb-6">Professional variant with full data structures (grouped inclusions, specifications, notes)</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  <PricingCard
                    productName="DORA"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    groupedInclusions={[
                      {
                        title: "Core Metrics",
                        items: ["Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Sed do eiusmod tempor incididunt", "Ut labore et dolore magna"]
                      },
                      {
                        title: "Advanced Features",
                        items: ["Magna aliqua enim ad minim", "Veniam quis nostrud exercitation", "Ullamco laboris nisi ut aliquip", "Ex ea commodo consequat"]
                      }
                    ]}
                    specifications={[
                      { label: "Data Sources", value: "Lorem ipsum dolor" },
                      { label: "Update Frequency", value: "Consectetur adipiscing" },
                      { label: "Dashboard Views", value: "Sed do eiusmod" },
                      { label: "Export Formats", value: "Ut labore et dolore" },
                      { label: "Integrations", value: "Magna aliqua enim" }
                    ]}
                    notes={[
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    ]}
                    variant="professional"
                  />
                  <PricingCard
                    productName="Viz"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    groupedInclusions={[
                      {
                        title: "Visualization Tools",
                        items: ["Duis aute irure dolor", "In reprehenderit voluptate", "Velit esse cillum dolore", "Eu fugiat nulla pariatur"]
                      },
                      {
                        title: "Data Management",
                        items: ["Excepteur sint occaecat", "Cupidatat non proident", "Sunt in culpa qui officia", "Deserunt mollit anim"]
                      }
                    ]}
                    specifications={[
                      { label: "Chart Types", value: "Lorem ipsum dolor" },
                      { label: "Data Sources", value: "Consectetur adipiscing" },
                      { label: "Refresh Rate", value: "Sed do eiusmod" },
                      { label: "Export Options", value: "Ut labore et dolore" },
                      { label: "Sharing", value: "Magna aliqua enim" }
                    ]}
                    notes={[
                      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
                      "Totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae."
                    ]}
                    variant="professional"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Unified Panel */}
        <section id="unified-panel" className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-mono mb-4">Unified Panel</h2>
            <p className="text-muted-foreground mb-4">Used in: Wireframe B for side-by-side comparison</p>

            <div className="max-w-4xl mx-auto">
              <UnifiedPricingPanel
                products={[
                  {
                    name: "DORA",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    inclusions: ["Lorem ipsum analytics", "Consectetur reports", "Adipiscing integration"]
                  },
                  {
                    name: "Viz",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    inclusions: ["Lorem ipsum visualization", "Consectetur dashboards", "Adipiscing charts"]
                  }
                ]}
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Social Proof */}
        <section id="social-proof" className="py-8">
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold font-mono mb-4">Social Proof Section</h2>
            <p className="text-muted-foreground mb-4">Used in: All wireframes (A, B, C)</p>
          </div>
          <SocialProofSection />
        </section>

        <Separator className="my-8" />

        {/* How It Works Variations */}
        <HowItWorksA />

        <Separator className="my-8" />

        <HowItWorksB />

        <Separator className="my-8" />

        <HowItWorksC />

        <Separator className="my-8" />

        {/* FAQ Section */}
        <section id="faq" className="py-8">
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold font-mono mb-4">FAQ Section</h2>
            <p className="text-muted-foreground mb-4">Used in: All wireframes (A, B, C)</p>
          </div>
          <FAQSection />
        </section>

        <Separator className="my-8" />

        {/* Final CTA */}
        <section id="final-cta" className="py-8">
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold font-mono mb-4">Final CTA Section</h2>
            <p className="text-muted-foreground mb-4">Used in: All wireframes (A, B, C)</p>
          </div>
          <FinalCTASection />
        </section>
      </main>
    </div>
  );
};

export default ComponentsPreview;
