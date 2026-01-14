import {
  WireframeHeader,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  FeatureGrid,
  ComparisonTable,
  ProcessStep,
  TestimonialCard,
} from "@wireframe/core";
import { ArrowRight, Zap, Shield, Target } from "lucide-react";
import metadata from "../metadata.json";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        projectTitle={metadata.title}
        routes={[{ path: metadata.routes.index, label: "Home" }]}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Component Showcase
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the shared components available in the wireframe framework
            </p>
          </section>

          {/* Buttons & Basic UI */}
          <section id="components">
            <h2 className="text-2xl font-bold mb-6">Buttons & Basic UI</h2>
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  Multiple button styles for different use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </CardContent>
            </Card>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards are versatile containers for content and actions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With different content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Action
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Third Card</CardTitle>
                  <CardDescription>More examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Responsive grid layout</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Metric Cards */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Metric Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                icon={Zap}
                label="Fast Setup"
                value="5 min"
                description="From clone to first wireframe"
              />
              <MetricCard
                icon={Shield}
                label="Type Safe"
                value="100%"
                description="Full TypeScript coverage"
              />
              <MetricCard
                icon={Target}
                label="WCAG AA"
                value="Compliant"
                description="Accessibility built-in"
              />
            </div>
          </section>

          {/* Feature Grid */}
          <section id="patterns">
            <h2 className="text-2xl font-bold mb-6">Feature Grid</h2>
            <FeatureGrid
              features={[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Built with Vite for instant hot module replacement",
                },
                {
                  icon: Shield,
                  title: "Type Safe",
                  description: "Full TypeScript support with strict mode enabled",
                },
                {
                  icon: Target,
                  title: "Accessible",
                  description: "WCAG 2.1 AA compliant components out of the box",
                },
              ]}
            />
          </section>

          {/* Process Steps */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Process Steps</h2>
            <div className="space-y-6">
              <ProcessStep
                stepNumber={1}
                title="Clone Repository"
                description="Get started by cloning the wireframe framework to your local machine"
              />
              <ProcessStep
                stepNumber={2}
                title="Run Setup"
                description="Install dependencies and configure your first project"
              />
              <ProcessStep
                stepNumber={3}
                title="Build Wireframes"
                description="Use shared components to create wireframe variants"
              />
            </div>
          </section>

          {/* Testimonial Card */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
            <TestimonialCard
              quote="This framework transformed how we prototype. We went from weeks to days."
              author="Design Team Lead"
              role="Tech Startup"
            />
          </section>

          {/* Comparison Table */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Comparison Table</h2>
            <ComparisonTable
              columns={["Feature", "Basic", "Pro", "Enterprise"]}
              rows={[
                ["Wireframe Projects", "1", "5", "Unlimited"],
                ["Shared Components", "✓", "✓", "✓"],
                ["Agent Workflows", "✗", "✓", "✓"],
                ["Business Context", "✗", "✓", "✓"],
                ["Priority Support", "✗", "✗", "✓"],
              ]}
            />
          </section>

          {/* Info Box */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Ready to Build?</CardTitle>
              <CardDescription>
                These components are available in all wireframe projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Import any component from <code className="bg-background px-1 py-0.5 rounded">@wireframe/core</code> and
                start building. Check the documentation for complete API reference.
              </p>
              <div className="flex gap-4">
                <Button>View Documentation</Button>
                <Button variant="outline">Create Wireframe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
