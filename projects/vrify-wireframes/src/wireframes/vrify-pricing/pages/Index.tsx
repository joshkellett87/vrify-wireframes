import { Link } from "react-router-dom";
import { WireframeButton } from "../components/wireframe/WireframeButton";
import { WireframeHeader } from "@/shared/components/WireframeHeader";
import metadata from "../metadata.json";

type PricingVariant = {
  name?: string;
  label?: string;
  description?: string;
  hypothesis?: string;
  ctaLabel?: string;
};

const toVariantLabel = (index: number) =>
  `Variant ${String.fromCharCode("A".charCodeAt(0) + index)}`;

const Index = () => {
  const variantEntries = Object.entries(
    (metadata as { variants?: Record<string, PricingVariant> }).variants ?? {}
  );

  const variantCards = variantEntries.map(([slug, variant], index) => {
    const label = variant.label ?? toVariantLabel(index);
    const name = variant.name ?? label;
    const description = variant.description ?? variant.hypothesis ?? "";
    const href = `/${metadata.slug}/${slug}`;
    const cta = variant.ctaLabel ?? `View ${label}`;

    return {
      key: slug,
      label,
      name,
      description,
      href,
      cta,
    };
  });

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
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="h2-heading">VRIFY Pricing Wireframes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {variantCards.map((variant) => (
                <div key={variant.key} className="flex flex-col h-full p-6 border border-border rounded-lg">
                  <h3 className="h3-heading mb-3">{variant.label}</h3>
                  <p className="caption-text text-muted-foreground flex-grow mb-4">
                    <strong>{variant.name}</strong>{" "}
                    {variant.description && `— ${variant.description}`}
                  </p>
                  <div className="mt-auto pt-2">
                    <Link to={variant.href} className="block w-full">
                      <WireframeButton variant="primary" className="w-full">{variant.cta}</WireframeButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 border border-border bg-accent">
              <h3 className="h3-heading mb-4 text-center">Component Library</h3>
              <p className="caption-text text-muted-foreground mb-4">
                View all UI components and sections consolidated on one page for easy stakeholder review
              </p>
              <div className="text-center">
                <Link to="/vrify-pricing/components-preview">
                  <WireframeButton variant="primary">View Component Library</WireframeButton>
                </Link>
              </div>
            </div>

            <div className="mt-16 space-y-8">
              <div className="p-6 bg-accent">
                <h3 className="h3-heading mb-6 text-center">What "inclusions" vs "specs" mean—and why both</h3>
                <div className="space-y-4 body-text text-muted-foreground">
                  <p><strong>Inclusions</strong> = capabilities/entitlements a buyer receives ("what you can do / what's included").</p>
                  <p><strong>Specs</strong> = measurable, verifiable attributes/limits ("how it behaves / constraints").</p>
                  <p><strong>Why both:</strong> inclusions help non-technical buyers shortlist quickly; specs de-risk procurement and InfoSec by making claims testable (formats, limits, SSO, SLAs).</p>
                  <p><strong>UI implication:</strong> inclusions get room for brief microcopy; specs live in a dense, grouped table.</p>
                </div>
              </div>

              <div className="p-6 bg-accent">
                <h3 className="h3-heading mb-6 text-center">Design considerations</h3>
                <div className="space-y-4 body-text text-muted-foreground">
                  <p><strong>Facts-first, lean page</strong> with strong CTAs; no prices or term toggles. This supports late-stage evaluation and reduces friction.</p>
                  <p><strong>Two standalone product sections</strong> (DORA, Viz) with matched schemas to compare mentally without implying plan tiers. (The brief positions two products and shows inclusions immediately after the hero.)</p>
                  <p><strong>Hero uses a two-column layout</strong> (copy + optional non-bleed image) to match site patterns and keep the fold for product content.</p>
                  <p><strong>How it works is expanded</strong> to 3–5 phases (not micro) to satisfy technical validators while staying scannable. (Original brief calls for a quick explainer tied to explainability/human-in-the-loop.)</p>
                  <p><strong>Chipless navigation and dense but clean modules</strong> to prevent UI noise and ensure we can house 8–12 inclusions and 12–16 spec rows per product.</p>
                  <p><strong>CTA visibility</strong> near product sections and in the final band to capture high-intent traffic.</p>
                </div>
              </div>

              <div className="p-6 bg-accent">
                <h3 className="h3-heading mb-6 text-center">Page goal and per-section outcomes</h3>
                <div className="space-y-4 body-text text-muted-foreground">
                  <p><strong>Overall page goal:</strong> deliver a facts-first explanation of the offer (two products, concise inclusions, explainer, key FAQs) and a clear path to Sales—without showing prices or term toggles.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Hero</h4>
                      <p className="caption-text">Orient fast. State the products and the path to buy; build confidence to scan options.</p>

                      <h4 className="font-semibold text-foreground">Plans & inclusions</h4>
                      <p className="caption-text">Shortlist quickly. Put DORA and Viz options immediately after the hero so buyers can see what's in each without wading through prose.</p>

                      <h4 className="font-semibold text-foreground">Social proof</h4>
                      <p className="caption-text">Reduce perceived risk mid-page. Serve as reassurance once a candidate option is in mind.</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">How it works</h4>
                      <p className="caption-text">De-risk adoption. Provide a compact flow that demonstrates explainability and human-in-the-loop (we expand this into clearer phases in the wireframes).</p>

                      <h4 className="font-semibold text-foreground">FAQ</h4>
                      <p className="caption-text">Remove purchase blockers. Address pricing posture, data & onboarding, IP/privacy/security, and procurement to reduce back-and-forth and enable outreach.</p>

                      <h4 className="font-semibold text-foreground">Final CTA</h4>
                      <p className="caption-text">Create a decisive next step. Prompt demo/quote once options and FAQs are understood.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
