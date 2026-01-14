#!/usr/bin/env node

/**
 * Interactive Init Wizard
 * Guides users through creating their first wireframe project
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../..");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  prompt: (msg) => `${colors.yellow}?${colors.reset} ${msg}`,
};

/**
 * Create readline interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question
 */
function ask(rl, question, defaultValue = "") {
  return new Promise((resolve) => {
    const prompt = defaultValue
      ? `${log.prompt(question)} (${defaultValue}): `
      : `${log.prompt(question)}: `;

    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate project slug
 */
function validateSlug(slug) {
  if (!slug) return "Project slug is required";
  if (!/^[a-z0-9-]+$/.test(slug)) return "Slug must be lowercase letters, numbers, and hyphens only";
  if (slug.length < 3) return "Slug must be at least 3 characters";
  if (slug.length > 50) return "Slug must be less than 50 characters";
  return null;
}

/**
 * Check if project already exists
 */
function projectExists(slug) {
  const projectsDir = path.join(rootDir, "projects");
  const projectDir = path.join(projectsDir, slug);
  return fs.existsSync(projectDir);
}

/**
 * Copy template files with replacements
 */
function copyTemplate(templateName, targetDir, replacements) {
  const templateDir = path.join(__dirname, "../templates/projects", templateName);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Copy all files recursively
  function copyRecursive(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const files = fs.readdirSync(src);
      files.forEach((file) => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      let content = fs.readFileSync(src, "utf-8");

      // Apply replacements
      Object.entries(replacements).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        content = content.replace(regex, value);
      });

      fs.writeFileSync(dest, content);
    }
  }

  copyRecursive(templateDir, targetDir);
}

/**
 * Create project workspace structure
 */
function createProjectWorkspace(slug) {
  const projectDir = path.join(rootDir, "projects", slug);

  if (fs.existsSync(projectDir)) {
    throw new Error(`Project '${slug}' already exists`);
  }

  // Create directory structure
  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src/wireframes"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src/pages"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "context/temp"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "public"), { recursive: true });

  // Create .gitkeep for empty wireframes directory
  fs.writeFileSync(path.join(projectDir, "src/wireframes/.gitkeep"), "");

  return projectDir;
}

/**
 * Create project configuration files
 */
function createProjectConfig(projectDir, slug) {
  // package.json
  const packageJson = {
    name: `wireframe-project-${slug}`,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      "build:dev": "vite build --mode development",
      preview: "vite preview",
      lint: "eslint .",
      "validate:metadata": `node ../../packages/wireframe-core/scripts/validate-metadata.mjs --project ${slug}`,
      orchestrate: `node ../../packages/wireframe-core/scripts/orchestrator.mjs --project ${slug}`,
      "self-iterate": `node ../../packages/wireframe-core/scripts/self-iterate.mjs --project ${slug}`,
      "ux:review": `node ../../scripts/ux-review.mjs --project ${slug}`,
    },
    dependencies: {
      "@wireframe/core": "workspace:*",
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^6.30.1",
    },
    devDependencies: {
      "@vitejs/plugin-react-swc": "^3.11.0",
      "lovable-tagger": "^1.0.13",
      tailwindcss: "^3.4.17",
      typescript: "^5.8.3",
      vite: "^7.0.0",
    },
  };

  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  // vite.config.ts
  const viteConfig = `import { createWireframeViteConfig } from "@wireframe/core/configs/vite";
import { componentTagger } from "lovable-tagger";

export default createWireframeViteConfig({
  plugins: [componentTagger()],
});
`;

  fs.writeFileSync(path.join(projectDir, "vite.config.ts"), viteConfig);

  // tailwind.config.ts
  const tailwindConfig = `import { createWireframeTailwindConfig } from "@wireframe/core/configs/tailwind";

export default createWireframeTailwindConfig();
`;

  fs.writeFileSync(path.join(projectDir, "tailwind.config.ts"), tailwindConfig);

  // tsconfig.json
  const tsConfig = {
    extends: "../../packages/wireframe-core/configs/tsconfig.base.json",
    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
        "@wireframe/core": ["../../packages/wireframe-core/src/index.ts"],
      },
    },
    include: ["src"],
    exclude: ["node_modules", "dist"],
  };

  fs.writeFileSync(
    path.join(projectDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2) + "\n"
  );

  // index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wireframe Project - ${slug}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(projectDir, "index.html"), indexHtml);

  // src/main.tsx
  const mainTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../../../packages/wireframe-core/src/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

  fs.writeFileSync(path.join(projectDir, "src/main.tsx"), mainTsx);

  // src/App.tsx
  const appTsx = `import { Suspense, lazy } from "react";
import {
  Toaster,
  Toaster as Sonner,
  TooltipProvider,
  generateAllWireframeRoutes,
  validateRouteUniqueness,
  ErrorBoundary,
} from "@wireframe/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Lazy load the home page
const Home = lazy(() => import("./pages/Home"));

// Validate route uniqueness on startup
const routeValidation = validateRouteUniqueness();
if (!routeValidation.valid) {
  console.error("⚠️  Route conflicts detected:");
  routeValidation.conflicts.forEach((conflict) => console.error(\`  - \${conflict}\`));
}

// Generate routes dynamically from all project metadata files
const wireframeRoutes = generateAllWireframeRoutes();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              {/* Home/Platform index page */}
              <Route path="/" element={<Home />} />

              {/* Dynamically generated routes from metadata.json files */}
              {wireframeRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}

              {/* Catch-all 404 route */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">404</h1><p className="text-muted-foreground">Page not found</p></div></div>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
`;

  fs.writeFileSync(path.join(projectDir, "src/App.tsx"), appTsx);

  // src/vite-env.d.ts
  const viteEnv = `/// <reference types="vite/client" />
`;

  fs.writeFileSync(path.join(projectDir, "src/vite-env.d.ts"), viteEnv);

  // src/pages/Home.tsx
  const homeTsx = `import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjectSummaries } from "@wireframe/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@wireframe/core";
import { Button } from "@wireframe/core";
import { ArrowRight, Layers, Plus } from "lucide-react";

const Home = () => {
  const projects = getAllProjectSummaries();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Wireframe Platform</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Wireframe Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create, manage, and iterate on wireframe projects with variant testing and business context.
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
            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>
                  {projects.reduce((sum, p) => sum + p.variantCount, 0)} Total Variants
                </span>
              </div>
            )}
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
        </div>
      </main>
    </div>
  );
};

export default Home;
`;

  fs.writeFileSync(path.join(projectDir, "src/pages/Home.tsx"), homeTsx);
}

/**
 * Update root wireframe.config.json
 */
function updateRootConfig(projectSlug) {
  const configPath = path.join(rootDir, "wireframe.config.json");

  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }

  // Set default project if not already set
  if (!config.defaultProject) {
    config.defaultProject = projectSlug;
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

/**
 * Main wizard flow
 */
async function runWizard() {
  const rl = createInterface();

  console.log("");
  console.log("═".repeat(60));
  console.log(`${colors.cyan}${colors.bold}Wireframe Framework - Interactive Setup${colors.reset}`);
  console.log("═".repeat(60));
  console.log("");
  log.info("Let's create your first wireframe project!");
  console.log("");

  try {
    // Step 1: Project slug
    log.section("Project Details");
    const title = await ask(rl, "Project title", "My Wireframe");
    const suggestedSlug = toKebabCase(title);
    let slug = await ask(rl, "Project slug (URL-friendly ID)", suggestedSlug);

    // Validate slug
    let slugError = validateSlug(slug);
    while (slugError || projectExists(slug)) {
      if (slugError) {
        log.error(slugError);
      } else {
        log.error(`Project '${slug}' already exists`);
      }
      slug = await ask(rl, "Project slug");
      slugError = validateSlug(slug);
    }

    const description = await ask(
      rl,
      "Brief description",
      "A wireframe project"
    );

    // Step 2: Template selection
    log.section("Template Selection");
    console.log("");
    console.log("  1. Blank - Minimal starting point");
    console.log("  2. Showcase - Component library examples");
    console.log("  3. Example - Full project with variants");
    console.log("");

    let templateChoice = await ask(rl, "Choose template (1-3)", "1");
    while (!["1", "2", "3"].includes(templateChoice)) {
      log.error("Please choose 1, 2, or 3");
      templateChoice = await ask(rl, "Choose template (1-3)", "1");
    }

    const templates = { 1: "blank", 2: "showcase", 3: "example" };
    const templateName = templates[templateChoice];

    // Step 3: Business context (optional)
    log.section("Business Context (Optional)");
    const setupBusinessContext = await ask(
      rl,
      "Set up business context? Recommended for strategic wireframes (y/n)",
      "n"
    );

    const includeBusinessContext =
      setupBusinessContext.toLowerCase() === "y" ||
      setupBusinessContext.toLowerCase() === "yes";

    rl.close();

    // Create the project
    log.section("Creating Project");
    log.info(`Creating project workspace: ${slug}`);

    const projectDir = createProjectWorkspace(slug);
    log.success("Created project directory structure");

    createProjectConfig(projectDir, slug);
    log.success("Created configuration files");

    // Copy first wireframe from template
    const wireframeDir = path.join(projectDir, `src/wireframes/${slug}`);
    const replacements = {
      PROJECT_ID: slug,
      PROJECT_SLUG: slug,
      PROJECT_TITLE: title,
      PROJECT_DESCRIPTION: description,
      TIMESTAMP: new Date().toISOString(),
    };

    copyTemplate(templateName, wireframeDir, replacements);
    log.success(`Created wireframe from '${templateName}' template`);

    // Update root config
    updateRootConfig(slug);
    log.success("Updated wireframe.config.json");

    // Business context note
    if (includeBusinessContext) {
      console.log("");
      log.info(
        "To set up business context, run: npm run orchestrate -- --project " +
          slug
      );
    }

    // Success message
    console.log("");
    console.log("═".repeat(60));
    log.success("Project created successfully!");
    console.log("═".repeat(60));
    console.log("");

    // Next steps
    log.section("Next Steps:");
    console.log("");
    console.log("  1. Install dependencies:");
    console.log(`     ${colors.cyan}cd projects/${slug} && npm install${colors.reset}`);
    console.log("");
    console.log("  2. Start the development server:");
    console.log(`     ${colors.cyan}npm run dev${colors.reset}`);
    console.log("");
    console.log("  3. Open your browser:");
    console.log(`     ${colors.cyan}http://localhost:8080${colors.reset}`);
    console.log("");
    console.log("  4. View your wireframe:");
    console.log(`     ${colors.cyan}http://localhost:8080/${slug}${colors.reset}`);
    console.log("");

    if (templateName === "blank") {
      log.info("Pro tip: Check the showcase template to see available components");
    }

    console.log("");
  } catch (error) {
    rl.close();
    console.error("");
    log.error(`Failed to create project: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the wizard
runWizard().catch((error) => {
  console.error("");
  log.error(`Init wizard failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
