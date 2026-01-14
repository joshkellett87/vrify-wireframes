#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import {
  resolveProjectPath,
  resolveProjectRoot,
  resolveProjectSlug
} from './utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    applyRoutes: null, // 'root' | 'namespace' | null
    selfIteration: null,
    autoFix: null,
    maxIterations: null,
    project: null
  };

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (typeof token !== 'string') continue;

    if (token.startsWith('--apply-routes=')) {
      const val = token.split('=')[1];
      if (val === 'root' || val === 'namespace') out.applyRoutes = val;
    } else if (token === '--apply-routes') {
      const val = args[i + 1];
      if (val === 'root' || val === 'namespace') out.applyRoutes = val;
    } else if (token === '--self-iteration') {
      out.selfIteration = true;
    } else if (token === '--no-self-iteration') {
      out.selfIteration = false;
    } else if (token === '--auto-fix') {
      out.autoFix = true;
    } else if (token === '--no-auto-fix') {
      out.autoFix = false;
    } else if (token === '--max-iterations') {
      const value = parseInt(args[i + 1], 10);
      if (!Number.isNaN(value)) out.maxIterations = value;
    } else if (token.startsWith('--max-iterations=')) {
      const value = parseInt(token.split('=')[1], 10);
      if (!Number.isNaN(value)) out.maxIterations = value;
    } else if (token === '--project') {
      out.project = args[i + 1];
      i += 1;
    } else if (token.startsWith('--project=')) {
      out.project = token.split('=')[1];
    }
  }

  return out;
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, 'utf8');
}

function recordScaffoldHistory({
  projectName,
  slug,
  applyRoutes,
  selfIteration,
  autoFix,
  maxIterations,
  projectSlug
}) {
  try {
    const outDir = resolveProjectPath(import.meta.url, 'context/temp-agent-outputs/scaffold', {
      project: projectSlug
    });
    ensureDir(outDir);
    const historyPath = path.join(outDir, 'history.jsonl');
    const entry = {
      timestamp: new Date().toISOString(),
      projectName,
      slug,
      applyRoutes: applyRoutes || null,
      flags: {
        selfIteration,
        autoFix,
        maxIterations: Number.isFinite(maxIterations) ? maxIterations : null
      },
      user: process.env.USER || process.env.USERNAME || null,
      argv: process.argv.slice(2)
    };
    fs.appendFileSync(historyPath, `${JSON.stringify(entry)}\n`, 'utf8');
  } catch (error) {
    console.warn(`[scaffold] Unable to append scaffold history: ${error.message}`);
  }
}

function buildSelfIterationFlagArgs({ selfIteration, autoFix, maxIterations }) {
  const parts = [];
  if (selfIteration === true) parts.push('--self-iteration');
  if (selfIteration === false) parts.push('--no-self-iteration');
  if (Number.isFinite(maxIterations)) parts.push(`--max-iterations=${maxIterations}`);
  if (autoFix === true) parts.push('--auto-fix');
  if (autoFix === false) parts.push('--no-auto-fix');
  return parts;
}

function formatSelfIterationSummary({ selfIteration, autoFix, maxIterations }) {
  const summary = [];

  if (selfIteration === true) summary.push('enabled');
  else if (selfIteration === false) summary.push('disabled');
  else summary.push('config default');

  if (Number.isFinite(maxIterations)) summary.push(`maxIterations=${maxIterations}`);

  if (autoFix === true) summary.push('autoFix:on');
  else if (autoFix === false) summary.push('autoFix:off');

  return summary.join(', ');
}

function metadataJson({ title, slug }) {
  const sections = [
    { name: 'Hero', anchor: 'hero' },
    { name: 'Value Proposition', anchor: 'value' },
    { name: 'How It Works', anchor: 'how-it-works' },
    { name: 'Capabilities', anchor: 'capabilities' },
    { name: 'Use Cases', anchor: 'use-cases' },
    { name: 'Proof', anchor: 'proof' },
    { name: 'Primary CTA', anchor: 'cta' },
    { name: 'Resources', anchor: 'resources' }
  ];

  // Schema v2.0 compliant metadata:
  // - variants as keyed object (keys become URL segments)
  // - routes.index only (variant routes auto-derived)
  // - businessContext initialized (can be populated later)
  return JSON.stringify({
    schema_version: '2.0',
    id: slug,
    slug,
    title,
    description: `${title} — generated wireframe project`,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().slice(0, 10),
    projectType: 'multi-variant',
    variants: {
      'option-a': {
        name: 'Option A',
        description: 'Conversion-forward approach',
        emphasis: 'CTA early; concise proof; product teaser',
        when: 'Use for warm audiences ready to convert',
        hypothesis: '',
        businessContextRef: {
          goalIds: [],
          personaIds: []
        }
      },
      'option-b': {
        name: 'Option B',
        description: 'Trust-first approach',
        emphasis: 'Logos, metrics, case studies earlier',
        when: 'Use for colder audiences needing proof',
        hypothesis: '',
        businessContextRef: {
          goalIds: [],
          personaIds: []
        }
      },
      'option-c': {
        name: 'Option C',
        description: 'Product-story approach',
        emphasis: 'How it works before capabilities; narrative flow',
        when: 'Use for technical evaluators wanting depth',
        hypothesis: '',
        businessContextRef: {
          goalIds: [],
          personaIds: []
        }
      }
    },
    sections: sections.map(s => ({
      name: s.name,
      anchor: s.anchor,
      whyNow: '',
      jtbd: { situation: '', motivation: '', outcome: '' }
    })),
    routes: {
      index: `/${slug}`,
      resources: [`/${slug}/resources`]
    },
    businessContext: {
      primaryGoal: '',
      goals: [],
      personas: [],
      kpis: []
    }
  }, null, 2);
}

function component(name, body, options = {}) {
  // Build imports based on what the component needs
  const imports = ['import React from "react";'];

  // Add common @/shared imports for components that use UI primitives
  if (options.useButton) {
    imports.push('import { Button } from "@/shared/ui/button";');
  }
  if (options.useCard) {
    imports.push('import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";');
  }

  return `${imports.join('\n')}

export const ${name} = () => {
  return (
    <section id="${kebab(name.replace('Section',''))}" className="wireframe-section" aria-label="${name.replace('Section', '')}">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            ${body}
          </div>
        </div>
      </div>
    </section>
  );
};
`;
}

function kebab(s) { return s.trim().toLowerCase().replace(/\s+/g,'-'); }
function pascalCase(s) { return s.split(/[-_\s]+/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(''); }

function updateAppTsx({ slug, mode, projectRoot }) {
  const appPath = path.join(projectRoot, 'src', 'App.tsx');
  if (!fs.existsSync(appPath)) {
    console.warn('! Skipping App.tsx update: file not found');
    return;
  }
  const backupPath = appPath + '.bak.' + Date.now();
  const content = fs.readFileSync(appPath, 'utf8');

  const importPrefix = pascalCase(slug);
  const importBlock = [
    `import ${importPrefix}Index from "./wireframes/${slug}/pages/Index";`,
    `import ${importPrefix}OptionA from "./wireframes/${slug}/pages/OptionA";`,
    `import ${importPrefix}OptionB from "./wireframes/${slug}/pages/OptionB";`,
    `import ${importPrefix}OptionC from "./wireframes/${slug}/pages/OptionC";`,
    `import ${importPrefix}Resources from "./wireframes/${slug}/pages/Resources";`
  ];

  let updated = content;

  // Skip if already imported
  if (!updated.includes(`./wireframes/${slug}/pages/Index`)) {
    const lines = updated.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportIdx = i;
      if (lines[i].startsWith('const queryClient')) break; // stop at code
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, ...importBlock);
      updated = lines.join('\n');
    }
  }

  // Prepare routes block
  const ns = mode === 'namespace';
  const base = ns ? `/${slug}` : '';
  const routeBlock = [
    `          <Route path="${base || '/'}" element={<${importPrefix}Index />} />`,
    `          <Route path="${base}/option-a" element={<${importPrefix}OptionA />} />`,
    `          <Route path="${base}/option-b" element={<${importPrefix}OptionB />} />`,
    `          <Route path="${base}/option-c" element={<${importPrefix}OptionC />} />`,
    `          <Route path="${base}/resources" element={<${importPrefix}Resources />} />`
  ].join('\n');

  if (!updated.includes(`<Route path="${base || '/'}" element={<${importPrefix}Index />}`)) {
    const lines = updated.split('\n');
    let catchAllIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('path="*"') && lines[i].includes('NotFound')) {
        catchAllIdx = i;
        break;
      }
    }
    if (catchAllIdx === -1) {
      // fallback: look for the guidance comment
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('ADD ALL CUSTOM ROUTES ABOVE')) {
          catchAllIdx = i;
          break;
        }
      }
    }
    if (catchAllIdx !== -1) {
      lines.splice(catchAllIdx, 0, routeBlock);
      updated = lines.join('\n');
    }
  }

  if (updated !== content) {
    fs.copyFileSync(appPath, backupPath);
    fs.writeFileSync(appPath, updated, 'utf8');
    console.log(`✓ App.tsx updated (${mode} mode). Backup: ${path.basename(backupPath)}`);
  } else {
    console.log('• App.tsx already contained imports/routes or could not insert safely (no changes).');
  }
}

function pageIndexTsx(slug) {
  return `import { WireframeHeader } from "@/shared/components/WireframeHeader";
import { WireframeCard } from "@/shared/components/WireframeCard";
import { WireframeFooter } from "@/shared/components/WireframeFooter";
import metadata from "../metadata.json";

const Index = () => {
  // Schema v2.0: variants are keyed objects, routes derived from keys
  const baseRoute = metadata.routes?.index || "/${slug}";
  const variantsObj = metadata.variants || {};

  const variants = Object.entries(variantsObj).map(([key, v]: [string, any]) => ({
    title: v.name || key,
    description: v.description || "",
    href: \`\${baseRoute}/\${key}\`,
    emphasis: v.emphasis || "",
    when: v.when || ""
  }));

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader />
      <main className="py-16">
        <div className="wireframe-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold baseline-rhythm mb-4">{metadata.title} — Variants</h1>
            <p className="text-lg text-muted-foreground baseline-rhythm">Choose a layout to preview. Variants share sections but differ in emphasis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {variants.map((v) => (
              <WireframeCard key={v.title} title={v.title} description={v.description} href={v.href} emphasis={v.emphasis} when={v.when} />
            ))}
          </div>
        </div>
      </main>
      <WireframeFooter />
    </div>
  );
};

export default Index;
`;
}

function pageVariantTsx(order, variantName) {
  return `import { WireframeHeader } from "@/shared/components/WireframeHeader";
import { WireframeFooter } from "@/shared/components/WireframeFooter";
import { HeroSection } from "../components/HeroSection";
import { ValuePropositionSection } from "../components/ValuePropositionSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { CapabilitiesSection } from "../components/CapabilitiesSection";
import { UseCasesSection } from "../components/UseCasesSection";
import { ProofSection } from "../components/ProofSection";
import { CTASection } from "../components/CTASection";
import { ResourcesSection } from "../components/ResourcesSection";
import { PageAnchorNav } from "../components/PageAnchorNav";

const ${variantName} = () => {
  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader />
      <HeroSection />
      <PageAnchorNav />
      ${order}
      <ResourcesSection />
      <WireframeFooter />
    </div>
  );
};

export default ${variantName};
`;
}

function pageResourcesTsx(title) {
  return `import { WireframeHeader } from "@/shared/components/WireframeHeader";
import { WireframeFooter } from "@/shared/components/WireframeFooter";

const Resources = () => (
  <div className="min-h-screen bg-background">
    <WireframeHeader />
    <main className="py-16">
      <div className="wireframe-container">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold baseline-rhythm mb-4">Resources</h1>
          <p className="text-lg text-muted-foreground">This is a placeholder resources page for ${title}.</p>
        </div>
      </div>
    </main>
    <WireframeFooter />
  </div>
);

export default Resources;
`;
}

function briefTemplate(title) {
  return `Project Name: ${title}
Primary Goal: [e.g., Book a demo]
Target Audience(s): [e.g., CEO, Geologist, Investor]

Sections & JTBD (edit as needed)
1) Hero — Situation | Motivation | Outcome
2) Value Proposition — Situation | Motivation | Outcome
3) How It Works — Situation | Motivation | Outcome
4) Capabilities — Situation | Motivation | Outcome
5) Use Cases — Situation | Motivation | Outcome
6) Proof — Situation | Motivation | Outcome
7) Primary CTA — Situation | Motivation | Outcome
8) Resources — Situation | Motivation | Outcome

Routing Preference: Root-level (/, /option-a, /option-b, /option-c) [yes/no]
Variants: Default to A/B/C unless specified otherwise.
`;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const cliOptions = parseArgs();
  const { applyRoutes, selfIteration, autoFix, maxIterations } = cliOptions;
  try {
    const projectSlug = resolveProjectSlug(import.meta.url, { project: cliOptions.project });
    const projectRoot = resolveProjectRoot(import.meta.url, { project: projectSlug });

    const name = (await rl.question('Project name (e.g., "Product Launch"): ')).trim();
    if (!name) throw new Error('Project name is required');
    const suggested = slugify(name);
    const slug = (await rl.question(`Project slug [${suggested}]: `)).trim() || suggested;

    const root = resolveProjectPath(import.meta.url, `src/wireframes/${slug}`, {
      project: projectSlug
    });
    if (fs.existsSync(root)) {
      throw new Error(`Directory already exists: ${root}`);
    }

    // Create directories
    ensureDir(path.join(root, 'components'));
    ensureDir(path.join(root, 'pages'));

    // Write metadata.json & brief.txt
    writeFile(path.join(root, 'metadata.json'), metadataJson({ title: name, slug }));
    writeFile(path.join(root, 'brief.txt'), briefTemplate(name));

    // Components
    writeFile(path.join(root, 'components', 'HeroSection.tsx'), component('HeroSection', `
            <h2 className="text-2xl font-semibold baseline-rhythm">${name}</h2>
            <p className="text-muted-foreground">Concise value prop and primary CTA.</p>
    `));
    writeFile(path.join(root, 'components', 'ValuePropositionSection.tsx'), component('ValuePropositionSection', `
            <h3 className="text-xl font-semibold">Value Proposition</h3>
            <p className="text-sm text-muted-foreground">3-4 outcome bullets for decision-makers.</p>
    `));
    writeFile(path.join(root, 'components', 'HowItWorksSection.tsx'), component('HowItWorksSection', `
            <h3 className="text-xl font-semibold">How It Works</h3>
            <ol className="grid md:grid-cols-3 gap-4 text-sm">
              <li className="rounded border p-4">Step 1</li>
              <li className="rounded border p-4">Step 2</li>
              <li className="rounded border p-4">Step 3</li>
            </ol>
    `));
    writeFile(path.join(root, 'components', 'CapabilitiesSection.tsx'), component('CapabilitiesSection', `
            <h3 className="text-xl font-semibold">Capabilities</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded border p-4">Capability A</div>
              <div className="rounded border p-4">Capability B</div>
              <div className="rounded border p-4">Capability C</div>
            </div>
    `));
    writeFile(path.join(root, 'components', 'UseCasesSection.tsx'), component('UseCasesSection', `
            <h3 className="text-xl font-semibold">Use Cases</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded border p-4">By Role</div>
              <div className="rounded border p-4">By Company Type</div>
              <div className="rounded border p-4">By Industry</div>
            </div>
    `));
    writeFile(path.join(root, 'components', 'ProofSection.tsx'), component('ProofSection', `
            <h3 className="text-xl font-semibold">Proof</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded border p-4">Logos</div>
              <div className="rounded border p-4">Metrics</div>
              <div className="rounded border p-4">Case Study</div>
            </div>
    `));
    writeFile(path.join(root, 'components', 'CTASection.tsx'), component('CTASection', `
            <h3 className="text-xl font-semibold">Ready to see it?</h3>
            <Button size="lg">Book a demo</Button>
    `, { useButton: true }));
    writeFile(path.join(root, 'components', 'ResourcesSection.tsx'), component('ResourcesSection', `
            <h3 className="text-xl font-semibold">Related Resources</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Resource A</li>
              <li>Resource B</li>
              <li>Resource C</li>
            </ul>
    `));
    writeFile(path.join(root, 'components', 'PageAnchorNav.tsx'), `import metadata from "../metadata.json";

// Data-driven anchor navigation - reads from metadata.json sections
// Automatically stays in sync when sections are added/removed/renamed
export const PageAnchorNav = () => {
  // Skip hero (first section) as user is already at top
  const sections = (metadata.sections || []).slice(1);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) return null;

  return (
    <nav className="wireframe-section py-6" aria-label="Page sections">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div className="flex items-center justify-center">
              <div className="flex w-full max-w-4xl items-center justify-center gap-2 rounded border border-border bg-muted/30 px-4 py-4 text-sm">
                {sections.map((section: { anchor: string; name: string }) => (
                  <button
                    key={section.anchor}
                    type="button"
                    onClick={() => handleScroll(section.anchor)}
                    className="flex-1 min-w-[100px] max-w-[140px] rounded border border-transparent bg-background/80 px-3 py-2 text-center text-muted-foreground transition-all duration-200 ease-platform hover:border-border hover:text-foreground whitespace-nowrap"
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
`);

    // Pages
    writeFile(path.join(root, 'pages', 'Index.tsx'), pageIndexTsx(slug));
    // Variant orders
    const orderA = `<ValuePropositionSection />\n      <HowItWorksSection />\n      <CapabilitiesSection />\n      <UseCasesSection />\n      <ProofSection />\n      <CTASection />`;
    const orderB = `<ProofSection />\n      <ValuePropositionSection />\n      <HowItWorksSection />\n      <CapabilitiesSection />\n      <UseCasesSection />\n      <CTASection />`;
    const orderC = `<HowItWorksSection />\n      <CapabilitiesSection />\n      <ValuePropositionSection />\n      <UseCasesSection />\n      <ProofSection />\n      <CTASection />`;

    writeFile(path.join(root, 'pages', 'OptionA.tsx'), pageVariantTsx(orderA, 'OptionA'));
    writeFile(path.join(root, 'pages', 'OptionB.tsx'), pageVariantTsx(orderB, 'OptionB'));
    writeFile(path.join(root, 'pages', 'OptionC.tsx'), pageVariantTsx(orderC, 'OptionC'));
    writeFile(path.join(root, 'pages', 'Resources.tsx'), pageResourcesTsx(name));

    console.log(`\n✓ Scaffolding complete: ${path.relative(projectRoot, root)}`);

    if (applyRoutes === 'root' || applyRoutes === 'namespace') {
      updateAppTsx({ slug, mode: applyRoutes, projectRoot });
    } else {
      console.log(
        `- Add routes in projects/${projectSlug}/src/App.tsx if you want this project served at root or under /${slug}`
      );
      console.log(`  Tip: rerun with --apply-routes=root or --apply-routes=namespace to automate this step.`);
    }

    recordScaffoldHistory({
      projectName: name,
      slug,
      applyRoutes,
      selfIteration,
      autoFix,
      maxIterations,
      projectSlug
    });

    if (selfIteration !== null || autoFix !== null || Number.isFinite(maxIterations)) {
      const summary = formatSelfIterationSummary({ selfIteration, autoFix, maxIterations });
      console.log(`- Self-iteration preferences: ${summary}`);

      const orchestratorFlags = buildSelfIterationFlagArgs({ selfIteration, autoFix, maxIterations });
      if (orchestratorFlags.length) {
        console.log(
          `  Tip: npm run orchestrate -- --project ${projectSlug} ${orchestratorFlags.join(' ')}`
        );
      }
    }

    console.log(
      `- Run: npm run dev --workspace projects/${projectSlug}  (then open ${
        applyRoutes === 'namespace' ? `/${slug}` : '/'
      } and variants)`
    );
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
  } finally {
    rl?.close();
  }
}

main();
