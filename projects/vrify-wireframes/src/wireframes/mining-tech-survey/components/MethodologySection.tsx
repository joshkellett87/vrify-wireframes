

interface MethodologySectionProps {
  variant?: "default" | "elevated";
}

export const MethodologySection = ({ variant = "default" }: MethodologySectionProps) => {
  return (
    <section id="methodology" className="wireframe-section" aria-labelledby="methodology-heading">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
          <div className={`${variant === "elevated" ? "border-t-4 border-wireframe-400 pt-6" : ""} mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between`}>
            <div>
              <h2 id="methodology-heading" className="text-2xl font-semibold baseline-rhythm">Research Methodology</h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Dig into who we surveyed, how we ran the study, and why these insights are trustworthy.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Questions? Skip ahead to the <a href="#faq" className="text-primary hover:underline">FAQ</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr]">
            <div className="space-y-4">
              <article className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Who we heard from</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  1,247 leaders across operations, technology, and strategy roles at mining organizations spanning 12 countries.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• 58% enterprise (5,000+ employees)</li>
                  <li>• 34% mid-market (500–4,999 employees)</li>
                  <li>• 8% emerging producers</li>
                </ul>
              </article>

              <article className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">How we fielded</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  30-minute online survey managed by an independent panel partner with follow-up validation interviews for edge cases.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Third-party verification: Bias checks, deduplication, and manual QA to maintain ±3.1% margin of error at 95% confidence.
                </p>
              </article>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {[
                  { label: "Fieldwork window", value: "July 8 – Sept 2, 2024" },
                  { label: "Regions covered", value: "NA, LATAM, APAC, EMEA" },
                  { label: "Incentive", value: "$150 USD honorarium" },
                  { label: "Panel mix", value: "Curated industry + VRIFY customers" }
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-dashed border-wireframe-200 p-4 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Quality controls</p>
                <p className="mt-2">
                  Screening logic, attention checks, and manual review kept the completion rate at 64% with verified company domains.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
