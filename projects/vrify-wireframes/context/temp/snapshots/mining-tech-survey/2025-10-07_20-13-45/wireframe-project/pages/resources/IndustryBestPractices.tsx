import { WireframeFooter } from "../../components/MiningTechFooter";
import { WireframeHeader } from "../../components/MiningTechHeader";

const IndustryBestPractices = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />

      <main className="py-16">
        <div className="wireframe-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase text-muted-foreground tracking-wide baseline-rhythm-sm">
              Playbook
            </p>
            <h1 className="text-4xl font-bold baseline-rhythm mb-6">
              Industry Best Practices Guide
            </h1>
            <p className="text-lg text-muted-foreground baseline-rhythm mb-10">
              A practical guide highlighting how leading operations teams structure pilots, measure
              ROI, and scale proven digital workflows across sites.
            </p>
            <div className="space-y-6 text-left bg-card border border-border rounded-xl p-8">
              <div>
                <h2 className="text-xl font-semibold baseline-rhythm-sm mb-2">Guide outline:</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Executive one-pager to share with stakeholders</li>
                  <li>RACI examples for cross-functional launch teams</li>
                  <li>Checklist for tracking value capture post-implementation</li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold baseline-rhythm-sm mb-2">Placeholder notice</h3>
                <p className="text-sm text-muted-foreground baseline-rhythm-sm">
                  Content production is underway. This stub ensures the navigation flow from the Mining
                  Tech Survey landing page remains intact without dead-end links.
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

export default IndustryBestPractices;
