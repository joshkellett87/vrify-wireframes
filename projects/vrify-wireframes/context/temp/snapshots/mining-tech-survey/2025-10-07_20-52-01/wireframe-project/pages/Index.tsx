import { WireframeHeader } from "../components/MiningTechHeader";
import { WireframeCard } from "../components/MiningTechCard";
import { WireframeFooter } from "../components/MiningTechFooter";
import metadata from "../metadata.json";

type VariantConfig = {
  name?: string;
  description?: string;
  emphasis?: string;
  when?: string;
};

const Index = () => {
  const variantEntries = Object.entries(
    (metadata as { variants?: Record<string, VariantConfig> }).variants ?? {}
  );

  const variants = variantEntries.map(([slug, variant]) => {
    const normalizedSlug = slug.trim();
    const href = `/${metadata.slug}/${normalizedSlug}`;

    return {
      key: normalizedSlug,
      title: variant.name ?? normalizedSlug,
      description: variant.description ?? "",
      href,
      emphasis: variant.emphasis ?? "",
      when: variant.when ?? "",
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />
      
      <main className="py-16">
        <div className="wireframe-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold baseline-rhythm mb-4">
              Mining Tech Survey Report — Wireframe Options
            </h1>
            <p className="text-lg text-muted-foreground baseline-rhythm mb-12">
              Select a layout to preview. All variants follow the same six-section structure with different emphasis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {variants.map((variant) => (
              <WireframeCard
                key={variant.key}
                title={variant.title || variant.key}
                description={variant.description}
                href={variant.href}
                emphasis={variant.emphasis}
                when={variant.when}
              />
            ))}
          </div>
          
          <div className="text-center">
            {/* Section Structure & JTBD Overview */}
            <div className="max-w-4xl mx-auto bg-wireframe-50 p-8 rounded-lg text-left">
              <h2 className="text-xl font-semibold mb-6">Common Structure & User Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-medium mb-2">1. Hero</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Orient visitors and expose the primary CTA immediately.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Confirm they’re in the right place and understand what action to take.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">2. Report Overview</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Preview the deliverable and scope without overwhelming detail.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Decide if the report is worth a download.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">3. Key Findings</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Showcase thematic insights and scorecards that tease value.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Provide quotable stats leaders can reuse internally.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">4. Methodology Snapshot</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Establish credibility before the deep dive.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Give quick trust signals for skimmers.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">5. Methodology Deep Dive</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Provide full transparency for decision-makers.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Answer rigor questions and address objections.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">6. FAQ</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Catch latent concerns before the conversion point.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Reduce friction for prospects who need clarity fast.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">7. Form</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Convert once value and trust are established.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Make the request feel quick and low-risk.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">8. Related Resources</h3>
                  <p className="text-muted-foreground mb-1"><strong>Why-Now:</strong> Provide a safe exit and keep users in the VRIFY ecosystem.</p>
                  <p className="text-muted-foreground"><strong>JTBD:</strong> Offer next steps for researchers not yet ready to convert.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <WireframeFooter />
    </div>
  );
};

export default Index;
