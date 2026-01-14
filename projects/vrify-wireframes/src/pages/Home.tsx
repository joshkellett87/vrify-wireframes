import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjectSummaries } from "@wireframe/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@wireframe/core";
import { Button } from "@wireframe/core";
import { ArrowRight, Layers, BookOpen, X, Plus } from "lucide-react";

const Home = () => {
  const projects = getAllProjectSummaries();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="129"
              height="26"
              viewBox="0 0 129 26"
              fill="none"
              className="h-4 w-auto text-foreground"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.0281 11.3697H17.1067L23.5786 0.15625H19.7809L14.2528 9.72928L8.72472 0.15625H4.94944L11.4213 11.3697H0.5V14.6506H11.4213L4.94944 25.8641H8.72472L14.2528 16.2911L19.7809 25.8641H23.5562L17.0843 14.6506H28.0056V11.3697H28.0281ZM16.927 14.5607L14.2528 16.0888L11.5787 14.5607V11.4821L14.2528 9.954L16.927 11.4821V14.5607Z"
                fill="currentColor"
              ></path>
              <path
                d="M50.0728 0.157303L44.2301 22.9213H42.2525L36.4098 0.157303H33.0391L39.7132 25.8652H46.7694L53.4436 0.157303H50.0728ZM70.4548 16.5618L72.9267 14.1124V3.10112L69.9829 0.157303H55.2863V25.8652H58.5896V17.0562H67.2188L71.3761 25.8652H74.9492L70.4773 16.5618H70.4548ZM69.6009 14.1124H58.5896V3.10112H69.6009V14.1124ZM88.4548 2.94382V0L82.2076 0.292135L75.9604 0V2.94382L80.5447 3.1236V22.8764L75.9604 23.0562V26L82.2076 25.7079L88.4548 26V23.0562L83.8705 22.8764V3.1236L88.4548 2.94382ZM106.882 3.10112V0.157303H90.6121V25.8652H93.9155V17.0562H106.14V14.1124H93.9155V3.07865H106.882V3.10112Z"
                fill="currentColor"
              ></path>
              <path
                d="M124.995 0.156494L121.41 14.1115H114.914L111.332 0.156494H107.961L111.399 13.37L112.356 17.0554H116.523V25.8644H119.826V17.0554H123.992L124.95 13.37L128.388 0.156494H124.995Z"
                fill="currentColor"
              ></path>
            </svg>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Design Specs</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Wireframe Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse wireframe variations for different pages and experiences.
              Each project contains multiple layout options optimized for
              different goals.
            </p>
          </div>

          {/* Project Count */}
          <div className="flex items-center justify-center gap-8 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>
                {projects.length} {projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>
                {projects.reduce((sum, p) => sum + p.variantCount, 0)} Total Variants
              </span>
            </div>
          </div>

          {/* Project Cards or Empty State */}
          {projects.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Wireframe
                </CardTitle>
                <CardDescription>
                  Get started by creating your first wireframe project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-sm">
                  <p>Choose from starter templates:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Blank</strong> - Start from scratch with minimal structure</li>
                    <li><strong>Showcase</strong> - See all available components</li>
                    <li><strong>Example</strong> - Full example with variants and business context</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Run this command in your terminal:
                  </p>
                  <code className="block bg-muted px-4 py-3 rounded text-sm">
                    npm run init
                  </code>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:border-primary transition-colors flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{project.title}</span>
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                        {project.variantCount}{" "}
                        {project.variantCount === 1 ? "variant" : "variants"}
                      </span>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        <span>ID:</span>
                        <code>{project.slug}</code>
                      </div>
                    </div>

                    <Link to={project.indexPath} className="mt-auto">
                      <Button className="w-full group">
                        View Wireframe
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-muted rounded-lg p-6 text-left max-w-2xl">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                About This Platform
              </h3>
              <p className="text-sm text-muted-foreground">
                This wireframe platform supports multiple isolated projects,
                each with its own variants, components, and routing. Projects
                are automatically discovered from{" "}
                <code className="bg-background px-1 py-0.5 rounded">
                  src/wireframes/*/metadata.json
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Wireframe Design Fundamentals</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground mb-6">
                This platform follows strict design principles to create consistent,
                accessible wireframes. Below are the core fundamentals that guide
                all wireframe development.
              </p>

              <h3 className="text-base font-semibold mb-3">Core Principles</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Purpose:</strong> Design artifacts for internal review,
                  not production-ready pages
                </li>
                <li>
                  <strong>Grayscale-first:</strong> 90% neutral grays, minimal color
                </li>
                <li>
                  <strong>Spacing rhythm:</strong> 4px for fine-tuning, 8px+ for structure
                </li>
                <li>
                  <strong>12-column grid:</strong> Max width 1280px, 24px gutters
                </li>
                <li>
                  <strong>Mobile-responsive:</strong> Test all breakpoints (640px, 768px, 1024px, 1280px)
                </li>
                <li>
                  <strong>WCAG 2.1 AA compliant:</strong> Contrast ratios ≥ 4.5:1 for text
                </li>
              </ul>

              <h3 className="text-base font-semibold mt-6 mb-3">Wireframe Anatomy</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Index Page:</strong> Presents 2-3 layout variants with context
                </li>
                <li>
                  <strong>Variant Pages:</strong> Different layouts testing specific hypotheses
                </li>
                <li>
                  <strong>Component Reuse:</strong> Shared components for consistency
                </li>
                <li>
                  <strong>Section-based:</strong> Clear visual separation between page sections
                </li>
              </ul>

              <h3 className="text-base font-semibold mt-6 mb-3">Typography</h3>
              <ul className="space-y-2 text-sm">
                <li>Body text: 14-16px (lean toward 14px for dense content)</li>
                <li>Line height: 1.5 for body, 1.2-1.3 for headings</li>
                <li>Sans-serif stack (Inter, system-ui)</li>
                <li>Clear heading hierarchy (H1-H6)</li>
              </ul>

              <h3 className="text-base font-semibold mt-6 mb-3">Layout Standards</h3>
              <ul className="space-y-2 text-sm">
                <li>Border radius: 4px for subtle rounding</li>
                <li>Focus indicators: 2px outline, high contrast</li>
                <li>Keyboard navigation: All interactive elements accessible</li>
                <li>Semantic HTML: Proper heading hierarchy and landmarks</li>
              </ul>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Full Documentation</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  For complete design specifications, routing architecture, and
                  implementation details, see:
                </p>
                <div className="space-y-1 text-xs">
                  <div className="font-mono bg-background px-2 py-1 rounded">
                    context/WIREFRAME-FUNDAMENTALS.md
                  </div>
                  <div className="font-mono bg-background px-2 py-1 rounded">
                    context/WIREFRAME-PATTERNS.md
                  </div>
                  <div className="font-mono bg-background px-2 py-1 rounded">
                    CLAUDE.md (development guide)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
