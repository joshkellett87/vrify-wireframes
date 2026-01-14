import { WireframeFooter } from "../../components/MiningTechFooter";
import { WireframeHeader } from "../../components/MiningTechHeader";

const MiningInnovationTrends = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />

      <main className="py-16">
        <div className="wireframe-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase text-muted-foreground tracking-wide baseline-rhythm-sm">
              Related Report
            </p>
            <h1 className="text-4xl font-bold baseline-rhythm mb-6">
              Mining Innovation Trends 2024
            </h1>
            <p className="text-lg text-muted-foreground baseline-rhythm mb-10">
              Explore the emerging technologies operators plan to pilot over the next 12 months,
              the barriers they expect to face, and how leaders are preparing their teams for
              adoption.
            </p>
            <div className="space-y-6 text-left bg-card border border-border rounded-xl p-8">
              <div>
                <h2 className="text-xl font-semibold baseline-rhythm-sm mb-2">Inside this spotlight:</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Survey sample of 180+ operations and exploration stakeholders</li>
                  <li>Top innovation priorities ranked by impact and feasibility</li>
                  <li>Investment outlook across exploration, operations, and ESG programs</li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold baseline-rhythm-sm mb-2">Coming soon</h3>
                <p className="text-sm text-muted-foreground baseline-rhythm-sm">
                  This page will eventually host the full report download and interactive charts. In the
                  meantime, it serves as a destination for the “Related Resources” section of the Mining
                  Tech Survey report landing page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WireframeFooter />
    </div>
  );
};

export default MiningInnovationTrends;
