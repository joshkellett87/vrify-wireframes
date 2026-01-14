import { WireframeHeader, Button, TestimonialCard, MetricCard, FeatureGrid } from "@wireframe/core";
import { Shield, Users, Award } from "lucide-react";
import metadata from "../metadata.json";

const TrustBuilding = () => {
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
        {/* Hero with Trust Signals */}
        <section id="hero" className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center gap-6 text-sm text-muted-foreground">
              <span>Trusted by 10,000+ teams</span>
              <span>•</span>
              <span>SOC 2 Certified</span>
              <span>•</span>
              <span>99.9% Uptime</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              The Platform Trusted by Industry Leaders
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join companies like Google, Amazon, and Microsoft who rely on our platform every day.
            </p>
          </div>

          {/* Social Proof Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <MetricCard
              icon={Users}
              label="Active Users"
              value="100K+"
              description="Worldwide and growing"
            />
            <MetricCard
              icon={Shield}
              label="Security"
              value="Enterprise"
              description="Bank-level encryption"
            />
            <MetricCard
              icon={Award}
              label="Awards"
              value="12+"
              description="Industry recognition"
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <TestimonialCard
                quote="This platform transformed our workflow completely. We saw a 3x increase in productivity within the first month."
                author="Sarah Johnson"
                role="VP of Engineering, TechCorp"
              />
              <TestimonialCard
                quote="The security and reliability are unmatched. We trust it with our most critical operations."
                author="Michael Chen"
                role="CTO, SecureData Inc"
              />
            </div>
          </div>
        </section>

        {/* Features with Trust Focus */}
        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Enterprise Security
          </h2>
          <FeatureGrid
            features={[
              {
                icon: Shield,
                title: "SOC 2 Certified",
                description: "Annual security audits and compliance certifications.",
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "24/7 enterprise support from our expert team.",
              },
              {
                icon: Award,
                title: "Industry Leading",
                description: "Recognized by Gartner and Forrester as a leader.",
              },
            ]}
          />
        </section>

        {/* CTA with Low Pressure */}
        <section id="cta" className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Start Your Risk-Free Trial
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See why industry leaders trust our platform. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              14-day trial • No credit card • Cancel anytime
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrustBuilding;
