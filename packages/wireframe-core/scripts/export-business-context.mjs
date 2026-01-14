#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { resolveProjectPath, resolveWorkspaceRoot } from "./utils/path-helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const headingMatchers = {
  shortTerm: /^###\s+Short-Term Objectives/i,
  midTerm: /^###\s+Mid-Term Objectives/i,
  kpis: /^###\s+Key Performance Indicators/i,
  projectSuccess: /^###\s+Success Metrics for This Project/i,
  primaryPersona: /^###\s+Primary Persona/i,
  secondaryPersona: /^###\s+Secondary Persona/i,
  secondaryAudiences: /^###\s+Secondary Audiences/i
};

export async function exportBusinessContext(options = {}) {
  let inputPath;
  let outputPath;

  try {
    inputPath = options.inputPath
      ? path.resolve(repoRoot, options.inputPath)
      : resolveProjectPath(import.meta.url, "context/BUSINESS-CONTEXT.md", {
          project: options.project,
        });

    outputPath = options.outputPath
      ? path.resolve(repoRoot, options.outputPath)
      : resolveProjectPath(
          import.meta.url,
          "context/temp-agent-outputs/business-context.json",
          { project: options.project },
        );
  } catch (error) {
    if (!options.quiet) {
      console.error(`[export-business-context] ${error.message}`);
    }
    throw error;
  }
  const quiet = Boolean(options.quiet);

  let markdown;
  try {
    markdown = await fs.readFile(inputPath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (!quiet) {
        console.warn(
          `[export-business-context] Skipping export — missing source file at ${inputPath}`
        );
      }
      return {
        exported: false,
        reason: 'missing_source',
        inputPath,
        outputPath
      };
    }
    throw error;
  }

  const parsed = parseBusinessContext(markdown);
  const payload = {
    ...parsed,
    source: path.relative(repoRoot, inputPath),
    exportedAt: new Date().toISOString()
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf-8');

  if (!quiet) {
    console.log(
      `[export-business-context] Wrote ${path.relative(
        repoRoot,
        outputPath
      )} (revisions: ${parsed.revisionHistory.length}, personas: ${parsed.personas.length})`
    );
  }

  return {
    exported: true,
    inputPath,
    outputPath,
    revisionCount: parsed.revisionHistory.length,
    personaCount: parsed.personas.length
  };
}

export function parseBusinessContext(markdown) {
  const lines = markdown.split(/\r?\n/);
  const revisionHistory = parseRevisionHistory(lines);

  const data = {
    revisionHistory,
    shortTermObjectives: [],
    midTermObjectives: [],
    keyPerformanceIndicators: [],
    successMetrics: [],
    personas: [],
    secondaryAudiences: []
  };
  const personaIds = new Set();
  const audienceIds = new Set();

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (headingMatchers.shortTerm.test(trimmed)) {
      const { items, nextIndex } = collectBulletBlock(lines, i + 1);
      data.shortTermObjectives = withIdentifiers(items, 'short-term');
      i = nextIndex - 1;
      continue;
    }

    if (headingMatchers.midTerm.test(trimmed)) {
      const { items, nextIndex } = collectBulletBlock(lines, i + 1);
      data.midTermObjectives = withIdentifiers(items, 'mid-term');
      i = nextIndex - 1;
      continue;
    }

    if (headingMatchers.kpis.test(trimmed)) {
      const { items, nextIndex } = collectBulletBlock(lines, i + 1);
      data.keyPerformanceIndicators = withIdentifiers(items, 'kpi');
      i = nextIndex - 1;
      continue;
    }

    if (headingMatchers.projectSuccess.test(trimmed)) {
      const { items, nextIndex } = collectBulletBlock(lines, i + 1, {
        allowParagraph: true
      });
      data.successMetrics = withIdentifiers(items, 'success');
      i = nextIndex - 1;
      continue;
    }

    if (
      headingMatchers.primaryPersona.test(trimmed) ||
      headingMatchers.secondaryPersona.test(trimmed)
    ) {
      const { persona, nextIndex } = parsePersona(lines, i);
      if (persona) {
        const baseId = persona.id || `persona-${persona.type || 'primary'}`;
        let candidate = baseId;
        let counter = 1;
        while (personaIds.has(candidate)) {
          candidate = `${baseId}-${++counter}`;
        }
        persona.id = candidate;
        personaIds.add(candidate);
        data.personas.push(persona);
      }
      i = nextIndex - 1;
      continue;
    }

    if (headingMatchers.secondaryAudiences.test(trimmed)) {
      const { audiences, nextIndex } = parseSecondaryAudiences(lines, i + 1);
      data.secondaryAudiences = audiences.map((entry, index) => {
        const base =
          (entry.name && slugify(entry.name)) ||
          slugify(entry.summary) ||
          `audience-${index + 1}`;
        let candidate = base;
        let counter = 1;
        while (audienceIds.has(candidate)) {
          candidate = `${base}-${++counter}`;
        }
        audienceIds.add(candidate);
        return { ...entry, id: candidate };
      });
      i = nextIndex - 1;
    }
  }

  const strategicGoals = {
    shortTerm: data.shortTermObjectives.map(entry => entry.label),
    midTerm: data.midTermObjectives.map(entry => entry.label),
    kpis: data.keyPerformanceIndicators.map(entry => entry.label),
    projectSuccessMetrics: data.successMetrics.map(entry => entry.label)
  };

  const targetAudiences = data.personas.map(persona => ({
    id: persona.id,
    name: persona.name,
    type: persona.type,
    profile: persona.profile || null,
    painPoints: [...persona.painPoints],
    motivations: [...persona.motivations],
    decisionRole: persona.decisionRole || null,
    notes: [...persona.notes]
  }));

  return {
    ...data,
    strategicGoals,
    targetAudiences
  };
}

function collectBulletBlock(lines, startIndex, options = {}) {
  const items = [];
  let sawContent = false;
  let i = startIndex;

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      if (sawContent) continue;
      else {
        continue;
      }
    }

    if (trimmed.startsWith('>')) {
      if (sawContent) continue;
      else continue;
    }

    if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
      break;
    }

    if (trimmed.startsWith('- ')) {
      sawContent = true;
      items.push(trimmed.slice(2).trim());
      continue;
    }

    if (options.allowParagraph) {
      sawContent = true;
      items.push(trimmed);
      continue;
    }

    if (sawContent) {
      break;
    }
  }

  return { items: items.filter(Boolean), nextIndex: i };
}

function parsePersona(lines, headingIndex) {
  const headingLine = lines[headingIndex].trim();
  const headingMatch = /^###\s+(Primary|Secondary)\s+Persona.*?:\s*(.+)$/.exec(
    headingLine
  );
  if (!headingMatch) {
    return { persona: null, nextIndex: headingIndex + 1 };
  }

  const [, personaType, personaName] = headingMatch;
  const persona = {
    type: personaType.toLowerCase(),
    name: personaName.trim(),
    id: slugify(personaName.trim()) || `persona-${personaType.toLowerCase()}`,
    profile: '',
    painPoints: [],
    motivations: [],
    decisionRole: '',
    notes: []
  };

  let currentArrayKey = null;
  let i = headingIndex + 1;

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) continue;
    if (trimmed.startsWith('###') || trimmed.startsWith('##')) break;

    const indent = raw.match(/^\s*/)[0].length;

    if (trimmed.startsWith('- **')) {
      const match = /^- \*\*(.+?)\*\*:\s*(.*)$/.exec(trimmed);
      if (!match) continue;
      const [, label, value] = match;
      const key = label.toLowerCase();
      currentArrayKey = null;

      switch (key) {
        case 'profile':
          persona.profile = value.trim();
          break;
        case 'pain points': {
          currentArrayKey = 'painPoints';
          const initial = value.trim();
          persona.painPoints = initial ? [initial] : [];
          break;
        }
        case 'motivations': {
          currentArrayKey = 'motivations';
          const initial = value.trim();
          persona.motivations = initial ? [initial] : [];
          break;
        }
        case 'decision role':
          persona.decisionRole = value.trim();
          break;
        default: {
          persona.notes.push(`${label}: ${value.trim()}`);
        }
      }
      continue;
    }

    if (trimmed.startsWith('-') && currentArrayKey) {
      persona[currentArrayKey].push(trimmed.replace(/^-+\s*/, '').trim());
      continue;
    }

    if (
      trimmed.startsWith('- ') &&
      !trimmed.startsWith('- **')
    ) {
      persona.notes.push(trimmed.slice(2).trim());
      continue;
    }
  }

  return { persona, nextIndex: i };
}

function parseSecondaryAudiences(lines, startIndex) {
  const audiences = [];
  let i = startIndex;

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('###') || trimmed.startsWith('##')) break;
    if (!trimmed.startsWith('- ')) continue;

    const match = /^- \*\*(.+?)\*\*:\s*(.+)$/.exec(trimmed);
    if (match) {
      const [, name, summary] = match;
      audiences.push({ name: name.trim(), summary: summary.trim() });
    } else {
      audiences.push({ name: null, summary: trimmed.slice(2).trim() });
    }
  }

  return { audiences, nextIndex: i };
}

function parseRevisionHistory(lines) {
  const revisions = [];
  const startIndex = lines.findIndex(line =>
    line.trim().toLowerCase().startsWith('| date')
  );
  if (startIndex === -1) return revisions;

  for (let i = startIndex + 2; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith('|')) break;
    const cells = trimmed
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim());
    if (cells.every(cell => cell.length === 0)) continue;
    const [date, editor, summary, source] = cells;
    revisions.push({
      date: date || null,
      editor: editor || null,
      summary: summary || null,
      source: source || null
    });
  }

  return revisions;
}

function withIdentifiers(items, prefix) {
  const seen = new Set();
  return items.map((label, index) => {
    const base = slugify(label);
    let id = base || `${prefix}-${index + 1}`;
    let candidate = id;
    let counter = 1;
    while (seen.has(candidate)) {
      counter += 1;
      candidate = `${id}-${counter}`;
    }
    seen.add(candidate);
    return { id: candidate, label: label.trim() };
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseCliArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--project':
      case '-p':
        args.project = argv[++i];
        break;
      case '--input':
        args.inputPath = argv[++i];
        break;
      case '--output':
        args.outputPath = argv[++i];
        break;
      case '--quiet':
        args.quiet = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default:
        break;
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node packages/wireframe-core/scripts/export-business-context.mjs [options]

Options:
  --project <slug> Project slug when multiple projects exist
  --input <path>   Source Markdown (default resolves to <project>/context/BUSINESS-CONTEXT.md)
  --output <path>  Destination JSON (default resolves to <project>/context/temp-agent-outputs/business-context.json)
  --quiet          Suppress info logs
  --help           Show this message
`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  exportBusinessContext(args).catch(error => {
    console.error('[export-business-context] Failed to export business context');
    console.error(error);
    process.exit(1);
  });
}
