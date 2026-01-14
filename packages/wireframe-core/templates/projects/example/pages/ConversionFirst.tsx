import { WireframeHeader, Button, Card, CardContent, CardHeader, CardTitle, FeatureGrid } from "@wireframe/core";
import { Zap, Target, TrendingUp } from "lucide-react";
import metadata from "../metadata.json";

const ConversionFirst = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        projectTitle={metadata.title}
        routes={[
          { path: metadata.routes.index, label: "Home" },
          { path: `${metadata.routes.index}/conversion-first`, label: "Conversion First" },
          { path: `${metadata.routes.index}/trust-building`, label: "Trust Building" },
        ]}
      />

      <main>
        {/* Hero with Prominent CTA */}
        <section id="hero" className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Start Your Free Trial Today
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already using our platform. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Succeed
            </h2>
            <FeatureGrid
              features={[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Deploy in minutes, not hours. Our platform is optimized for speed.",
                },
                {
                  icon: Target,
                  title: "Precision Targeting",
                  description: "Reach the right audience with advanced segmentation tools.",
                },
                {
                  icon: TrendingUp,
                  title: "Proven Results",
                  description: "95% of users see improvement within the first month.",
                },
              ]}
            />
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Start your 14-day free trial. No credit card required.
              </p>
              <Button size="lg" className="text-lg px-8">
                Create Account
              </Button>
              <p className="text-sm text-muted-foreground">
                Free for 14 days. Cancel anytime.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default ConversionFirst;
