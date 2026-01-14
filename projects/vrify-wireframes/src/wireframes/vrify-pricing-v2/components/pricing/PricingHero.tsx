import { WireframeButton } from "../wireframe/WireframeButton";

export const PricingHero = () => {
  return (
    <section id="hero" className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="space-y-6">
            <h1 className="hero-heading">
              VRIFY Platform Plans
            </h1>
            <p className="body-text text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </p>
            <div className="flex justify-center lg:justify-start">
              <WireframeButton variant="primary">
                Book a Demo
              </WireframeButton>
            </div>
          </div>
          <div>
            <div className="border-2 border-dashed border-wireframe-divider bg-wireframe-box flex items-center justify-center h-72 lg:h-80 w-full">
              <span className="text-wireframe-text font-mono text-sm">
                [Hero Image]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
