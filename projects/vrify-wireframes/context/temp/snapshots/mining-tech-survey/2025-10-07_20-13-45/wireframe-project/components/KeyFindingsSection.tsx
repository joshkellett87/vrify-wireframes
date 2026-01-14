import { SimpleBarChart } from "./SimpleBarChart";

interface KeyFindingsSectionProps {
  variant?: "default" | "elevated";
}

const efficiencyHighlights = [
  { stat: "73% adoption", description: "Automation tech deployed in core pit operations." },
  { stat: "45% faster cycles", description: "Weekly blast prep acceleration from digital scheduling." },
  { stat: "11.5 mo ROI", description: "Median payback period for remote asset monitoring." }
];

const investmentCallout = {
  eyebrow: "Capital efficiency",
  stat: "$4.7M",
  lead: "Avg. 2025 transformation budget among top performers",
  bullets: [
    "42% earmarked for autonomy + analytics",
    "3.2x ROI expectation within 18 months"
  ]
};

const investmentHighlights = [
  { stat: "$2.4M", description: "Mean 2025 spend earmarked for mine digitization projects." }
];

const peopleHighlights = [
  { stat: "92% satisfied", description: "Leaders report strong uptake with hybrid training programs." },
  { stat: "3.6×", description: "Higher retention when operations teams co-design pilots." },
  { stat: "~2 days saved", description: "Average weekly hours returned per frontline supervisor." }
];

const scorecards = [
  { label: "Net Innovation Score", value: "68", caption: "Composite index combining adoption, ROI, and satisfaction" },
  { label: "Readiness Gap", value: "22%", caption: "Share of orgs lagging peers on foundational systems" }
];

const ChartCard = ({ stat, description }: { stat: string; description: string }) => (
  <article className="bg-background border border-border rounded-xl p-6 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h4 className="font-mono text-xl font-semibold text-foreground">{stat}</h4>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
        •
      </span>
    </div>
    <div className="mb-4 h-24 rounded border border-dashed border-wireframe-200">
      <SimpleBarChart />
    </div>
    <p className="text-sm text-muted-foreground baseline-rhythm-sm">{description}</p>
  </article>
);

export const KeyFindingsSection = ({ variant = "default" }: KeyFindingsSectionProps) => {
  const showPeopleSection = variant !== "elevated";

  return (
    <section id="findings" className="wireframe-section">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold baseline-rhythm">Key Findings</h2>
                <p className="text-sm text-muted-foreground">
                  Each cluster ladders up to an executive takeaway—pair with the scorecards for quick reporting.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {scorecards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-border bg-background px-5 py-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
                    <p className="font-mono text-3xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <header className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Operational Efficiency</h3>
                  <div className="h-1 w-12 rounded-full bg-wireframe-300"></div>
                </header>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {efficiencyHighlights.map((highlight) => (
                    <ChartCard key={highlight.stat} {...highlight} />
                  ))}
                </div>
              </section>

              <section>
                <header className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Investment Momentum</h3>
                  <div className="h-1 w-12 rounded-full bg-wireframe-300"></div>
                </header>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <article className="md:col-span-2 flex flex-col justify-between rounded-xl border border-border bg-background p-6 shadow-sm">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{investmentCallout.eyebrow}</p>
                      <p className="font-mono text-4xl font-bold text-foreground">{investmentCallout.stat}</p>
                      <p className="text-sm text-muted-foreground baseline-rhythm-sm">{investmentCallout.lead}</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {investmentCallout.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                  {investmentHighlights.map((highlight) => (
                    <ChartCard key={highlight.stat} {...highlight} />
                  ))}
                </div>
              </section>

              {showPeopleSection && (
                <section>
                  <header className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">People &amp; Adoption</h3>
                    <div className="h-1 w-12 rounded-full bg-wireframe-300"></div>
                  </header>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {peopleHighlights.map((highlight) => (
                      <ChartCard key={highlight.stat} {...highlight} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
