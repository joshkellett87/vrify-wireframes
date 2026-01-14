import { Link } from "react-router-dom";
import { WireframeHeader } from "@/shared/components/WireframeHeader";

const variants = [
  {
    id: "banner-expanded",
    label: "A1",
    name: "Stacked Expanded",
    layout: "Stacked",
    dataUploader: "Banner",
    modules: "Expanded Cards",
    description: "Products stack vertically with Data Uploader at top. Each module (DORA, Cousteau, etc.) is shown as a separate card with all details visible immediately - no clicking needed.",
    designApproach: "Full-height vertical layout prioritizes reading flow. Users scroll to explore all information. Best for users who want to see everything at once.",
    hypothesis: "Showing all module details upfront reduces cognitive load. Users can scan and compare without interaction."
  },
  {
    id: "banner-accordion",
    label: "A2",
    name: "Stacked Accordion",
    layout: "Stacked",
    dataUploader: "Banner",
    modules: "Accordion",
    description: "Products stack vertically, but modules collapse into accordions. Click to expand each module and see its details. More compact than A1, but requires interaction.",
    designApproach: "Vertical scroll with progressive disclosure. Modules start collapsed to reduce page length. Users click to reveal details.",
    hypothesis: "Accordion pattern reduces initial overwhelm. Users expand only what interests them, leading to more focused exploration."
  },
  {
    id: "foundation-expanded",
    label: "B1",
    name: "Side-by-Side Expanded",
    layout: "Side-by-Side Cards",
    dataUploader: "Foundation Band",
    modules: "Expanded Cards",
    description: "Predict and Present sit side-by-side for easy comparison. All module details are visible within each card - no clicking needed to see features.",
    designApproach: "Two-column layout enables direct product comparison. Data Uploader spans full width above to establish foundation. Grouped features use two columns for density.",
    hypothesis: "Side-by-side placement makes differences between products immediately visible. Better for users comparing options."
  },
  {
    id: "foundation-accordion",
    label: "B2",
    name: "Side-by-Side Accordion",
    layout: "Side-by-Side Cards",
    dataUploader: "Foundation Band",
    modules: "Accordion",
    description: "Predict and Present side-by-side with collapsible modules. Cards stay compact until users click to expand specific modules.",
    designApproach: "Compact two-column comparison with expandable details. Best balance of comparison and space efficiency.",
    hypothesis: "Combining comparison layout with accordion creates the most compact view while still enabling detailed exploration."
  }
];

const Index = () => {
  const navItems = variants.map(v => ({
    to: `/vrify-pricing-v2/${v.id}`,
    label: v.label,
    end: false
  }));

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing-v2"
        projectTitle="Pricing V2"
        navItems={navItems}
      />

      {/* Hero */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold font-mono mb-3">Pricing Page V2 Wireframes</h1>
            <p className="text-base text-muted-foreground font-mono leading-relaxed mb-4">
              Reimagined pricing page layouts accommodating VRIFY Predict as a product suite
              with sub-products (DORA, Cousteau, Data Augmentation) while VRIFY Present
              remains a simpler standalone.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-mono">
                4 Variants
              </span>
              <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-mono">
                2 Layouts
              </span>
              <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-mono">
                Accordion + Expanded
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Variant Matrix */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold font-mono mb-6">Variant Matrix</h2>

          {/* Layout A: Stacked */}
          <div className="mb-8">
            <h3 className="text-lg font-bold font-mono mb-2 text-primary">
              Layout A: Stacked
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              Products arranged top-to-bottom in a single column. Data Uploader appears as a foundation banner above products. Best for focused, linear exploration of each product.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variants.filter(v => v.layout === "Stacked").map((variant) => (
                <VariantCard key={variant.id} variant={variant} />
              ))}
            </div>
          </div>

          {/* Layout B: Side-by-Side Cards */}
          <div>
            <h3 className="text-lg font-bold font-mono mb-2 text-primary">
              Layout B: Side-by-Side Cards
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              Predict and Present displayed side-by-side for direct comparison. Data Uploader spans full width above both products. Best for users comparing product offerings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variants.filter(v => v.layout === "Side-by-Side Cards").map((variant) => (
                <VariantCard key={variant.id} variant={variant} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Architecture Reference */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold font-mono mb-4">Product Architecture</h2>
          <div className="bg-white border rounded-lg p-4 font-mono text-xs">
            <pre className="whitespace-pre-wrap text-wireframe-text">
{`VRIFY Data Uploader (Foundational)
         ↓
┌─────────────────────┐   ┌──────────────────┐
│   VRIFY Predict     │   │   VRIFY Present  │
│   (3 modules)       │   │   (Standalone)   │
│ DORA | Cousteau |   │   │                  │
│ Data Augmentation   │   │ 3D Presentations │
└─────────────────────┘   └──────────────────┘`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

interface VariantCardProps {
  variant: typeof variants[0];
}

const VariantCard = ({ variant }: VariantCardProps) => (
  <Link
    to={`/vrify-pricing-v2/${variant.id}`}
    className="block border rounded-lg p-4 bg-white hover:border-primary transition-colors group"
  >
    <div className="flex items-start justify-between mb-2">
      <div>
        <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs font-mono font-bold mb-1">
          {variant.label}
        </span>
        <h4 className="text-base font-bold font-mono group-hover:text-primary transition-colors">
          {variant.name}
        </h4>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-mono">
          {variant.dataUploader}
        </span>
        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-mono">
          {variant.modules}
        </span>
      </div>
    </div>

    <p className="text-xs text-wireframe-text font-mono mb-3 leading-relaxed">
      {variant.description}
    </p>

    <div className="space-y-2 pt-2 border-t">
      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
        <span className="font-semibold">Design:</span> {variant.designApproach}
      </p>
      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
        <span className="font-semibold">Hypothesis:</span> {variant.hypothesis}
      </p>
    </div>
  </Link>
);

export default Index;
