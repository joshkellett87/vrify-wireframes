import { WireframeHeader } from "../components/MiningTechHeader";
import { WireframeFooter } from "../components/MiningTechFooter";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader basePath="/mining-tech-survey" />
      
      <main className="py-16">
        <div className="wireframe-container">
          <div className="text-center">
            <h1 className="text-4xl font-bold baseline-rhythm mb-8">
              Resources
            </h1>
            <p className="text-lg text-muted-foreground baseline-rhythm max-w-2xl mx-auto">
              This is a placeholder resources page. In the full implementation, this would contain 
              various reports, case studies, whitepapers, and other valuable content.
            </p>
          </div>
        </div>
      </main>
      
      <WireframeFooter />
    </div>
  );
};

export default Resources;