import { WireframeHeader, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@wireframe/core";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import metadata from "../metadata.json";

const Index = () => {
  const variants = Object.entries(metadata.variants).map(([key, variant]) => ({
    key,
    ...variant,
    path: `${metadata.routes.index}/${key}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        projectTitle={metadata.title}
        routes={[
          { path: metadata.routes.index, label: "Home" },
          ...variants.map((v) => ({ path: v.path, label: v.title })),
        ]}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {metadata.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {metadata.description}
            </p>
          </section>

          {/* Variant Cards */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Wireframe Variants</h2>
            <p className="text-muted-foreground mb-8">
              This project demonstrates multiple layout strategies, each testing a different hypothesis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variants.map((variant) => (
                <Card key={variant.key} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{variant.title}</CardTitle>
                    <CardDescription>{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        <strong>Hypothesis:</strong> {variant.hypothesis}
                      </p>
                    </div>
                    <Link to={variant.path}>
                      <Button className="w-full group">
                        View Variant
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Business Context Info */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>About This Example</CardTitle>
              <CardDescription>
                A complete wireframe project with business context and variant strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <strong>What's included:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Multiple wireframe variants with distinct hypotheses</li>
                  <li>Business context linking (goals, personas, KPIs)</li>
                  <li>Shared component reuse across variants</li>
                  <li>Metadata-driven routing</li>
                </ul>
              </div>
              <div>
                <strong>Learn more:</strong>
                <p className="text-muted-foreground mt-2">
                  Check <code className="bg-background px-1 py-0.5 rounded">metadata.json</code> to see
                  how variants link to business goals and personas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
