import { WireframeHeader, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@wireframe/core";
import metadata from "../metadata.json";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        projectTitle={metadata.title}
        routes={[
          { path: metadata.routes.index, label: "Home" }
        ]}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section id="hero" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {metadata.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {metadata.description}
            </p>
          </section>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Your Wireframe is Ready</CardTitle>
              <CardDescription>
                Start building your wireframe by editing components and pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <strong>Next steps:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Add sections to <code className="bg-muted px-1 py-0.5 rounded">components/</code></li>
                    <li>Create variant pages in <code className="bg-muted px-1 py-0.5 rounded">pages/</code></li>
                    <li>Update <code className="bg-muted px-1 py-0.5 rounded">metadata.json</code> with variants</li>
                    <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm run validate:metadata</code> to check your work</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
