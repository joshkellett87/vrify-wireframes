

export const ReportOverviewSection = () => {
  return (
    <section id="overview" className="wireframe-section">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <header className="max-w-3xl">
              <h2 className="text-2xl font-semibold baseline-rhythm mb-4">Report Overview</h2>
              <p className="text-base text-muted-foreground baseline-rhythm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </header>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
                <article className="bg-background border border-border rounded-lg p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Report Essentials
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Survey responses</span>
                      <span className="font-medium text-foreground">1,247 participants</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fieldwork period</span>
                      <span className="font-medium text-foreground">Jul–Sep 2024</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Audience focus</span>
                      <span className="font-medium text-foreground">Mining & extraction</span>
                    </li>
                  </ul>
                </article>

                <article className="bg-background border border-border rounded-lg p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Inside the PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Technology adoption rates & barriers</li>
                    <li>Investment priorities and budget allocation</li>
                    <li>Operational efficiency benchmarks</li>
                    <li>Future-state roadmaps and readiness</li>
                  </ul>
                </article>
              </div>

              <aside className="flex flex-col justify-start gap-6 bg-background border border-border rounded-lg p-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Quick Stats</h3>
                  <p className="text-sm text-muted-foreground">
                    Use these as your elevator pitch when sharing the report internally.
                  </p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-muted-foreground">Average ROI window</dt>
                    <dd className="text-lg font-semibold text-foreground">11.5 months</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-muted-foreground">Confidence interval</dt>
                    <dd className="text-lg font-semibold text-foreground">±3.1%</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-muted-foreground">Top growth region</dt>
                    <dd className="text-lg font-semibold text-foreground">LATAM</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
