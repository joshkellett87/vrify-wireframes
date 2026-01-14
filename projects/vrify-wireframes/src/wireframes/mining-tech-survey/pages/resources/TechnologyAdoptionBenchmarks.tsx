import { WireframeFooter } from "../../components/MiningTechFooter";
import { WireframeHeader } from "../../components/MiningTechHeader";

const TechnologyAdoptionBenchmarks = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />

      <main className="py-16">
        <div className="wireframe-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase text-muted-foreground tracking-wide baseline-rhythm-sm">
              Benchmark Deck
            </p>
            <h1 className="text-4xl font-bold baseline-rhythm mb-6">
              Technology Adoption Benchmarks
            </h1>
            <p className="text-lg text-muted-foreground baseline-rhythm mb-10">
              Compare your operation’s digital roadmap against peer adoption curves, with focus on
              data integration, remote collaboration, and autonomous workflows.
            </p>
            <div className="space-y-6 text-left bg-card border border-border rounded-xl p-8">
              <div>
                <h2 className="text-xl font-semibold baseline-rhythm-sm mb-2">What’s included:</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Adoption timelines for 12 priority technologies</li>
                  <li>Peer-group comparisons segmented by mine type and region</li>
                  <li>Recommendations for aligning teams ahead of deployment</li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold baseline-rhythm-sm mb-2">Access forthcoming</h3>
                <p className="text-sm text-muted-foreground baseline-rhythm-sm">
                  The detailed benchmark package is in production. Linking here prevents visitors from
                  encountering placeholder “#” links and keeps them within the resource experience.
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

export default TechnologyAdoptionBenchmarks;
