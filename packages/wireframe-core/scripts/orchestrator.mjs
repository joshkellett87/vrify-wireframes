#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { createAutoSnapshot } from './lib/auto-snapshot.mjs';
import { detectPlatform } from './agents/platform.mjs';
import {
  ensureDir,
  pathExists,
  removeFile,
  readJson
} from './agents/fs-utils.mjs';
import { exportBusinessContext } from './export-business-context.mjs';
import {
  getAgentInfo,
  AGENT_SEQUENCE,
  flattenSequence,
  PATHS
} from './agents/definitions.mjs';
import {
  getStatePath,
  loadState,
  saveState,
  createInitialState,
  updatePhase,
  markStatus,
  appendCompletedAgent,
  setPendingAgents,
  setMetadata,
  pushError,
  markComplete
} from './agents/state.mjs';
import { validateAgentOutputs } from './agents/validators.mjs';
import { computeVariantScore, computeVisualScore } from './agents/scores.mjs';
import { prepareAgentPromptFile } from './agents/prompt.mjs';
import {
  resolveSelfIterationOptions,
  resolveConfigPath as resolveConfigFilePath
} from '../src/shared/lib/wireframe-config.mjs';
import { resolveProjectPath, resolveWorkspaceRoot } from './utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

function projectPath(relativePath, projectSlug) {
  return resolveProjectPath(import.meta.url, relativePath, { project: projectSlug });
}

// Path constants imported from definitions.mjs (single source of truth)
// Aliases for backward compatibility with existing orchestrator code
const TEMP_AGENT_OUTPUTS_RELATIVE = PATHS.TEMP_AGENT_OUTPUTS;
const WORKFLOW_STATE_RELATIVE = PATHS.WORKFLOW_STATE;
const BRIEF_ANALYSIS_JSON_RELATIVE = PATHS.BRIEF_ANALYSIS;
const BRIEF_ANALYSIS_SUMMARY_RELATIVE = PATHS.BRIEF_ANALYSIS_SUMMARY;
const STRATEGY_JSON_RELATIVE = PATHS.WIREFRAME_STRATEGY;
const STRATEGY_SUMMARY_RELATIVE = PATHS.WIREFRAME_STRATEGY_SUMMARY;
const BUSINESS_CONTEXT_JSON_RELATIVE = PATHS.BUSINESS_CONTEXT_JSON;
const BUSINESS_CONTEXT_VALIDATION_RELATIVE = PATHS.BUSINESS_CONTEXT_VALIDATION;
const BUSINESS_CONTEXT_VALIDATION_SUMMARY_RELATIVE = PATHS.BUSINESS_CONTEXT_VALIDATION_MD;
const SELF_ITERATION_RELATIVE = PATHS.SELF_ITERATION;
const BUSINESS_CONTEXT_MD_RELATIVE = PATHS.BUSINESS_CONTEXT_MD;
const BLUEPRINT_RELATIVE = PATHS.BLUEPRINT;

const SELF_ITERATION_ENV_KEYS = [
  'WIREFRAME_SELF_ITERATION',
  'WIREFRAME_SELF_ITERATION_MAX_ITERATIONS',
  'WIREFRAME_SELF_ITERATION_AUTO_FIX',
  'WIREFRAME_SELF_ITERATION_SNAPSHOT_DELAY_MS',
  'WIREFRAME_SELF_ITERATION_HISTORY_DIR',
  'WIREFRAME_SELF_ITERATION_DEV_SERVER_PORT'
];

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }

  if (args.agentHelp) {
    printAgentHelp(args.agentHelp);
    process.exit(0);
  }

  if (args.status || args.guide) {
    const snapshot = await buildWorkflowSnapshot({
      repoRoot,
      projectOverride: args.project
    });
    printStatusReport(snapshot);
    if (args.guide) {
      printWorkflowGuide(repoRoot);
    }
    process.exit(0);
  }

  const statePath = getStatePath(repoRoot, { project: args.project });

  if (args.reset) {
    if (pathExists(statePath)) {
      removeFile(statePath);
      console.log('> Removed existing workflow state.');
    }
    if (!args.resume && !args.start) {
      return;
    }
  }

  let state = await loadState(repoRoot, { project: args.project });
  const platformInfo = detectPlatform();

  const optionsFromArgs = extractOptions(args);
  let resolvedBusinessContextPath = null;
  let initializedState = false;

  if (!state) {
    if (!args.project) {
      console.error('! Missing required option: --project <slug>');
      printUsage();
      process.exit(1);
    }

    const candidateContextPath = optionsFromArgs.skipBusinessContext
      ? null
      : projectPath('context/BUSINESS-CONTEXT.md', args.project);

    resolvedBusinessContextPath =
      candidateContextPath && pathExists(candidateContextPath)
        ? candidateContextPath
        : null;

    state = createInitialState({
      projectSlug: args.project,
      platform: platformInfo.platform,
      capabilities: platformInfo.capabilities,
      briefPath: args.brief ? path.resolve(repoRoot, args.brief) : null,
      businessContextPath: resolvedBusinessContextPath,
      options: optionsFromArgs
    });

    const pendingAgents = deriveInitialPendingAgents(optionsFromArgs);
    state = setPendingAgents(state, pendingAgents);
    state = markStatus(state, 'in_progress');
    initializedState = true;
  } else {
    const mergedOptions = { ...state?.metadata?.options, ...optionsFromArgs };
    const metadataPatch = { options: mergedOptions };
    if (optionsFromArgs.notes) {
      metadataPatch.notes = optionsFromArgs.notes;
    }
    state = setMetadata(state, metadataPatch);

    const stateContext = state?.contextFiles?.businessContext || null;
    if (stateContext && pathExists(stateContext)) {
      resolvedBusinessContextPath = stateContext;
    } else if (!optionsFromArgs.skipBusinessContext) {
      const defaultContext = projectPath(
        'context/BUSINESS-CONTEXT.md',
        state?.projectSlug || args.project
      );
      resolvedBusinessContextPath = pathExists(defaultContext)
        ? defaultContext
        : null;
    }
  }

  state = applySelfIterationMetadata(state, optionsFromArgs.selfIteration);

  ensureDir(path.dirname(statePath));
  await saveState(repoRoot, state, { project: state?.projectSlug || args.project });

  if (initializedState) {
    console.log(`> Initialized workflow ${state.workflowId} for ${state.projectSlug}`);
  }

  const shouldExportContext = !optionsFromArgs.skipBusinessContext;
  const defaultContextPath = projectPath(
    'context/BUSINESS-CONTEXT.md',
    state?.projectSlug || args.project
  );
  const exportInputPath = optionsFromArgs.forceBusinessContext
    ? defaultContextPath
    : resolvedBusinessContextPath || defaultContextPath;

  if (shouldExportContext) {
    try {
      const result = await exportBusinessContext({
        inputPath: exportInputPath,
        quiet: true
      });
      if (!result.exported && result.reason === 'missing_source') {
        console.warn(
          `[orchestrator] Business context source missing at ${exportInputPath}. Run the business-context-gatherer agent or pass --skip-business-context to suppress this warning.`
        );
      }
    } catch (error) {
      console.warn('[orchestrator] Failed to export business context snapshot');
      console.warn(error);
    }
  }

  const finalState = await orchestrateWorkflow(state, platformInfo, optionsFromArgs);
  await handleUxReviewAfterWorkflow(finalState, optionsFromArgs);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--project':
        args.project = argv[++i];
        break;
      case '--brief':
        args.brief = argv[++i];
        break;
      case '--resume':
        args.resume = true;
        break;
      case '--reset':
        args.reset = true;
        break;
      case '--start':
        args.start = true;
        break;
      case '--skip-business-context':
        args.skipBusinessContext = true;
        break;
      case '--force-business-context':
        args.forceBusinessContext = true;
        break;
      case '--skip-visual':
        args.skipVisual = true;
        break;
      case '--force-visual':
        args.forceVisual = true;
        break;
      case '--skip-variant':
        args.skipVariant = true;
        break;
      case '--force-variant':
        args.forceVariant = true;
        break;
      case '--notes':
        args.notes = argv[++i];
        break;
      case '--prepare-prompts':
        args.preparePrompts = true;
        break;
      case '--status':
        args.status = true;
        break;
      case '--guide':
        args.guide = true;
        break;
      case '--agent-help':
        args.agentHelp = argv[++i];
        break;
      case '--self-iteration':
        args.selfIteration = true;
        break;
      case '--no-self-iteration':
        args.noSelfIteration = true;
        break;
      case '--auto-fix':
        args.autoFix = true;
        break;
      case '--no-auto-fix':
        args.noAutoFix = true;
        break;
      case '--max-iterations':
        args.maxIterations = parseInt(argv[++i], 10);
        break;
      case '--ux-review':
        args.uxReview = true;
        break;
      case '--ux-variant':
        args.uxReviewVariant = argv[++i];
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default: {
        if (typeof token === 'string') {
          if (token.startsWith('--max-iterations=')) {
            const value = token.split('=')[1];
            args.maxIterations = parseInt(value, 10);
            break;
          } else if (token.startsWith('--ux-variant=')) {
            args.uxReviewVariant = token.split('=')[1];
            break;
          }
        }
        if (!token.startsWith('--')) {
          args._ = args._ || [];
          args._.push(token);
        }
        break;
      }
    }
  }
  return args;
}

function printUsage() {
  console.log(`Wireframe agent orchestrator

Usage:
  node packages/wireframe-core/scripts/orchestrator.mjs --project <slug> [options]

Options:
  --project <slug>              Project slug (required for new workflows)
  --brief <path>                Path to design brief file
  --skip-business-context       Skip business context agent (legacy projects)
  --force-business-context      Force business context agent even if context exists
  --skip-visual                 Skip visual-ux-advisor regardless of score
  --force-visual                Force visual-ux-advisor to run
  --skip-variant                Skip variant-differentiator regardless of score
  --force-variant               Force variant-differentiator to run
  --prepare-prompts             Generate prompt template files for pending agents
  --notes <string>              Attach notes to workflow metadata
  --self-iteration              Force-enable self-iteration loop for this run
  --no-self-iteration           Disable self-iteration loop regardless of config
  --max-iterations <n>          Override max self-iteration loop count
  --auto-fix                    Allow automatic fixes during self-iteration
  --no-auto-fix                 Disable automatic fixes during self-iteration
  --ux-review                   Prepare UX review artifacts after agent workflow completes
  --ux-variant <key>            Variant key to review when --ux-review is set (default: index)
  --resume                      Resume existing workflow if present
  --reset                       Delete existing workflow state before running
  --status                      Show current workflow state summary
  --guide                       Print the workflow blueprint guide (optionally combine with --status)
  --agent-help <name>           Print helper instructions for a specific agent
  --help                        Show this help message
`);
}

function printAgentHelp(agentName) {
  const info = getAgentInfo(agentName);
  if (!info) {
    console.error(`! Unknown agent: ${agentName}`);
    process.exit(1);
  }

  console.log(`Agent: ${info.label}
Name: ${agentName}
Description: ${info.description}
Outputs:`);
  info.outputs.forEach(output => {
    console.log(`  - ${output.path}${output.required ? ' (required)' : ''}`);
  });
  console.log(`
Reference guidance:
  ${info.documentation}
`);
  console.log('Tips:');
  console.log('  • Review AGENT-WORKFLOWS.md for the full prompt template.');
  console.log('  • Write outputs to the paths listed above using markdown/JSON as required.');
  console.log('  • Re-run the orchestrator to validate and continue.');
}

function extractOptions(args) {
  const base = {
    skipBusinessContext: Boolean(args.skipBusinessContext),
    forceBusinessContext: Boolean(args.forceBusinessContext),
    skipVisual: Boolean(args.skipVisual),
    forceVisual: Boolean(args.forceVisual),
    skipVariant: Boolean(args.skipVariant),
    forceVariant: Boolean(args.forceVariant),
    preparePrompts: Boolean(args.preparePrompts),
    notes: args.notes || null,
    uxReview: Boolean(args.uxReview),
    uxReviewVariant: args.uxReviewVariant || null
  };

  const selfIterationOverrides = getSelfIterationOverridesFromArgs(args);
  if (selfIterationOverrides) {
    base.selfIteration = selfIterationOverrides;
  }

  return base;
}

function getSelfIterationOverridesFromArgs(args = {}) {
  const overrides = {};
  if (args.selfIteration === true) {
    overrides.enabled = true;
  } else if (args.noSelfIteration === true) {
    overrides.enabled = false;
  }

  if (Number.isFinite(args.maxIterations)) {
    overrides.maxIterations = args.maxIterations;
  }

  if (args.autoFix === true) {
    overrides.autoFix = true;
  } else if (args.noAutoFix === true) {
    overrides.autoFix = false;
  }

  return Object.keys(overrides).length ? overrides : null;
}

function applySelfIterationMetadata(state, cliOverrides) {
  if (!state) return state;

  const previousMeta = state?.metadata?.selfIteration || {};
  const previousOverrides = previousMeta.overrides || {};
  const mergedOverrides = mergeSelfIterationOverrides(previousOverrides, cliOverrides);
  const envOverrides = collectSelfIterationEnvOverrides();
  const configPath = resolveConfigFilePath();
  const resolvedOptions = resolveSelfIterationOptions({
    overrides: mergedOverrides,
    env: process.env
  });

  const invocationOverrides = cliOverrides
    ? mergeSelfIterationOverrides({}, cliOverrides)
    : null;

  const metadataPatch = {
    selfIteration: {
      resolved: resolvedOptions,
      overrides: mergedOverrides,
      lastInvocationOverrides: invocationOverrides,
      source: {
        configPath: path.relative(repoRoot, configPath),
        configExists: pathExists(configPath),
        env: envOverrides
      },
      updatedAt: new Date().toISOString()
    }
  };

  return setMetadata(state, metadataPatch);
}

function mergeSelfIterationOverrides(base = {}, incoming) {
  const result = { ...base };
  if (!incoming || typeof incoming !== 'object') {
    return result;
  }

  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'number' && Number.isNaN(value)) continue;
    result[key] = value;
  }

  return result;
}

function collectSelfIterationEnvOverrides(env = process.env) {
  return SELF_ITERATION_ENV_KEYS.reduce((acc, key) => {
    if (env?.[key] !== undefined) {
      acc[key] = env[key];
    }
    return acc;
  }, {});
}

function printStatusReport(snapshot) {
  console.log('Workflow Snapshot');
  if (!snapshot.hasState) {
    console.log('  (No workflow-state.json found; showing artifact scan only)');
  }
  console.log(`  Project       : ${snapshot.projectSlug || 'Not detected'}`);
  if (snapshot.workflowId) {
    console.log(`  Workflow      : ${snapshot.workflowId}`);
  }
  if (snapshot.status) {
    console.log(`  Status        : ${snapshot.status}`);
  }
  if (snapshot.currentPhase) {
    console.log(`  Current Phase : ${snapshot.currentPhase}`);
  }
  if (snapshot.startTime) {
    console.log(`  Started       : ${snapshot.startTime}`);
  }
  if (snapshot.endTime) {
    console.log(`  Completed     : ${snapshot.endTime}`);
  }
  if (snapshot.notes) {
    console.log(`  Notes         : ${snapshot.notes}`);
  }
  const pendingAgents = snapshot.pendingAgents || [];
  const completedAgents = snapshot.completedAgents || [];
  console.log(`  Pending Agents: ${pendingAgents.length ? pendingAgents.join(', ') : 'None'}`);
  console.log(`  Completed     : ${completedAgents.length ? completedAgents.join(', ') : 'None'}`);
  if (snapshot.errors && snapshot.errors.length) {
    console.log('  Errors        :');
    snapshot.errors.forEach(err => {
      const agentName = err.agentName || 'unknown agent';
      const message = err.error || err.message || String(err);
      console.log(`    - ${agentName}: ${message}`);
    });
  }

  const enrichment = snapshot.enrichmentDecisions;
  if (enrichment) {
    console.log('  Enrichment decisions:');
    if (enrichment.visual) {
      console.log(
        `    • visual-ux-advisor: ${enrichment.visual} (score=${enrichment.visualScore}, reasons=${(enrichment.visualReasons || []).join('/')})`
      );
    }
    if (enrichment.variant) {
      console.log(
        `    • variant-differentiator: ${enrichment.variant} (score=${enrichment.variantScore}, reasons=${(enrichment.variantReasons || []).join('/')})`
      );
    }
  }
  if (snapshot.selfIteration) {
    console.log(
      `  Self-Iteration : ${snapshot.selfIteration.enabled ? 'enabled' : 'disabled'} | maxIterations=${
        snapshot.selfIteration.maxIterations
      } | autoFix=${snapshot.selfIteration.autoFix ? 'on' : 'off'}`
    );
  }

  console.log('\nArtifacts:');
  if (snapshot.artifacts?.all?.length) {
    snapshot.artifacts.all.forEach(artifact => {
      const status = formatArtifactStatus(artifact.status);
      let line = `- ${artifact.label}: ${status}`;
      if (artifact.path) {
        line += ` — ${artifact.path}`;
      }
      if (artifact.updatedAt) {
        line += ` (updated ${artifact.updatedAt})`;
      }
      console.log(line);
      if (artifact.note) {
        console.log(`    • ${artifact.note}`);
      }
      if (artifact.extraPaths) {
        Object.entries(artifact.extraPaths).forEach(([key, value]) => {
          if (value) {
            console.log(`    • ${key}: ${value}`);
          }
        });
      }
    });
  } else {
    console.log('- None detected.');
  }

  console.log('\nOpen Tasks:');
  if (snapshot.openTasks.length) {
    snapshot.openTasks.forEach(task => {
      console.log(`- ${task.message}`);
    });
  } else {
    console.log('- None.');
  }

  console.log('\nNext Options:');
  if (snapshot.nextSteps.length) {
    snapshot.nextSteps.forEach((step, index) => {
      const prefix = `${index + 1}. ${step.command}`;
      const detail = step.detail ? ` — ${step.detail}` : '';
      console.log(`${prefix}${detail}`);
    });
  } else {
    console.log('- No immediate actions detected.');
  }
}

async function buildWorkflowSnapshot({ repoRoot, projectOverride } = {}) {
  const state = await loadState(repoRoot, { project: projectOverride });
  const projectSlug = projectOverride || state?.projectSlug || null;
  const artifacts = collectArtifacts(repoRoot, projectSlug, state);
  const pendingAgents = state?.pendingAgents || [];
  const completedAgents = (state?.completedAgents || []).map(entry => entry.name);
  const errors = (state?.errors || []).map(err => {
    if (typeof err === 'string') {
      return { agentName: null, error: err };
    }
    return {
      agentName: err?.agentName || err?.name || null,
      error: err?.error || err?.message || JSON.stringify(err)
    };
  });

  const snapshot = {
    hasState: Boolean(state),
    workflowId: state?.workflowId || null,
    status: state?.status || (state ? 'unknown' : 'not_initialized'),
    currentPhase: state?.currentPhase || null,
    projectSlug,
    startTime: state?.startTime || null,
    endTime: state?.endTime || null,
    pendingAgents,
    completedAgents,
    errors,
    notes: state?.metadata?.notes || null,
    enrichmentDecisions: state?.metadata?.enrichmentDecisions || null,
    selfIteration: state?.metadata?.selfIteration?.resolved || null,
    artifacts
  };

  snapshot.openTasks = computeOpenTasks(snapshot);
  snapshot.nextSteps = determineNextSteps(snapshot);
  return snapshot;
}

function collectArtifacts(repoRoot, projectSlug, state) {
  const artifacts = {};
  artifacts.workflowState = inspectWorkflowState(repoRoot, state);
  artifacts.briefAnalysis = inspectBriefAnalysis(repoRoot, projectSlug);
  artifacts.strategy = inspectStrategy(repoRoot, projectSlug);
  artifacts.businessContext = inspectBusinessContext(repoRoot, state);
  artifacts.metadataValidation = inspectMetadataValidation(repoRoot, projectSlug);
  artifacts.uiValidation = inspectUiValidation(repoRoot, projectSlug);
  artifacts.uxReview = inspectUxReview(repoRoot, projectSlug);

  artifacts.all = [
    artifacts.workflowState,
    artifacts.briefAnalysis,
    artifacts.strategy,
    artifacts.businessContext,
    artifacts.metadataValidation,
    artifacts.uiValidation,
    artifacts.uxReview
  ].filter(Boolean);

  return artifacts;
}

function inspectWorkflowState(repoRoot, state) {
  const info = getFileInfo(repoRoot, WORKFLOW_STATE_RELATIVE);
  if (!info) {
    return createArtifact({
      key: 'workflowState',
      label: 'Workflow state',
      status: 'missing',
      note: 'Run the orchestrator to initialize workflow-state.json.'
    });
  }

  return createArtifact({
    key: 'workflowState',
    label: 'Workflow state',
    status: 'ready',
    path: info.relativePath,
    updatedAt: info.updatedAt,
    note: state ? null : 'State file present but could not be read.'
  });
}

function inspectBriefAnalysis(repoRoot, projectSlug) {
  const jsonInfo = getFileInfo(repoRoot, BRIEF_ANALYSIS_JSON_RELATIVE, { projectSlug });
  const summaryInfo = getFileInfo(repoRoot, BRIEF_ANALYSIS_SUMMARY_RELATIVE, { projectSlug });

  let status = 'missing';
  let note = 'Brief analysis not generated.';
  let pathRef = null;
  let updatedAt = null;

  if (jsonInfo) {
    status = 'ready';
    note = summaryInfo ? `Summary available at ${summaryInfo.relativePath}` : null;
    pathRef = jsonInfo.relativePath;
    updatedAt = jsonInfo.updatedAt;
  } else if (summaryInfo) {
    status = 'partial';
    note = 'Summary exists but brief-analysis.json is missing.';
    pathRef = summaryInfo.relativePath;
    updatedAt = summaryInfo.updatedAt;
  }

  const extraPaths = {
    json: jsonInfo?.relativePath || null,
    summary: summaryInfo?.relativePath || null
  };

  return createArtifact({
    key: 'briefAnalysis',
    label: 'Brief analysis',
    status,
    path: pathRef,
    updatedAt,
    note,
    extraPaths
  });
}

function inspectStrategy(repoRoot, projectSlug) {
  const jsonInfo = getFileInfo(repoRoot, STRATEGY_JSON_RELATIVE, { projectSlug });
  const summaryInfo = getFileInfo(repoRoot, STRATEGY_SUMMARY_RELATIVE, { projectSlug });

  let status = 'missing';
  let note = 'Strategy artifacts not generated.';
  let pathRef = null;
  let updatedAt = null;

  if (jsonInfo) {
    status = 'ready';
    note = summaryInfo ? `Summary available at ${summaryInfo.relativePath}` : null;
    pathRef = jsonInfo.relativePath;
    updatedAt = jsonInfo.updatedAt;
  } else if (summaryInfo) {
    status = 'partial';
    note = 'Summary exists but wireframe-strategy.json is missing.';
    pathRef = summaryInfo.relativePath;
    updatedAt = summaryInfo.updatedAt;
  }

  const extraPaths = {
    json: jsonInfo?.relativePath || null,
    summary: summaryInfo?.relativePath || null
  };

  return createArtifact({
    key: 'strategy',
    label: 'Wireframe strategy',
    status,
    path: pathRef,
    updatedAt,
    note,
    extraPaths
  });
}

function inspectBusinessContext(repoRoot, state) {
  const projectSlug = state?.projectSlug || null;
  const jsonInfo = getFileInfo(repoRoot, BUSINESS_CONTEXT_JSON_RELATIVE, { projectSlug });

  let contextRelative = null;
  if (state?.contextFiles?.businessContext) {
    contextRelative = normalizePathForDisplay(path.relative(repoRoot, state.contextFiles.businessContext));
  }
  const markdownCandidates = [contextRelative, BUSINESS_CONTEXT_MD_RELATIVE].filter(Boolean);
  let markdownInfo = null;
  for (const candidate of markdownCandidates) {
    const info = getFileInfo(repoRoot, candidate, { projectSlug });
    if (info) {
      markdownInfo = info;
      break;
    }
  }

  let status = 'missing';
  let note = 'Business context JSON not exported.';
  let pathRef = null;
  let updatedAt = null;

  if (jsonInfo) {
    status = 'ready';
    note = null;
    pathRef = jsonInfo.relativePath;
    updatedAt = jsonInfo.updatedAt;
  }

  if (markdownInfo) {
    if (!jsonInfo) {
      status = 'missing';
      note = 'Markdown exists; run npm run export:business-context.';
    } else {
      const mdTime = new Date(markdownInfo.updatedAt);
      const jsonTime = new Date(jsonInfo.updatedAt);
      if (mdTime > jsonTime) {
        status = 'stale';
        note = 'Markdown newer than JSON; run npm run export:business-context.';
      }
    }
  }

  const extraPaths = {
    source: markdownInfo?.relativePath || null
  };

  return createArtifact({
    key: 'businessContext',
    label: 'Business context JSON',
    status,
    path: pathRef,
    updatedAt,
    note,
    extraPaths
  });
}

function inspectMetadataValidation(repoRoot, projectSlug) {
  const jsonInfo = getFileInfo(repoRoot, BUSINESS_CONTEXT_VALIDATION_RELATIVE, { projectSlug });
  const summaryInfo = getFileInfo(repoRoot, BUSINESS_CONTEXT_VALIDATION_SUMMARY_RELATIVE, {
    projectSlug
  });

  let status = 'missing';
  let note = 'Metadata/context validation not yet run.';
  let pathRef = null;
  let updatedAt = null;

  if (jsonInfo) {
    status = 'ready';
    note = summaryInfo ? `Summary available at ${summaryInfo.relativePath}` : null;
    pathRef = jsonInfo.relativePath;
    updatedAt = jsonInfo.updatedAt;
  }

  const extraPaths = {
    summary: summaryInfo?.relativePath || null
  };

  return createArtifact({
    key: 'metadataValidation',
    label: 'Metadata/context validation',
    status,
    path: pathRef,
    updatedAt,
    note,
    extraPaths
  });
}

function inspectUiValidation(repoRoot, projectSlug) {
  if (!projectSlug) {
    return createArtifact({
      key: 'uiValidation',
      label: 'UI validation',
      status: 'missing',
      note: 'Provide a project slug to locate self-iteration outputs.'
    });
  }

  const projectDirRelative = path.join(SELF_ITERATION_RELATIVE, projectSlug);
  const projectDirAbsolute = projectPath(projectDirRelative, projectSlug);

  if (!pathExists(projectDirAbsolute)) {
    return createArtifact({
      key: 'uiValidation',
      label: 'UI validation',
      status: 'missing',
      note: 'No self-iteration runs detected for this project.'
    });
  }

  const iterations = fs
    .readdirSync(projectDirAbsolute)
    .map(name => path.join(projectDirAbsolute, name))
    .filter(entry => {
      try {
        return fs.statSync(entry).isDirectory();
      } catch {
        return false;
      }
    });

  const validations = [];
  iterations.forEach(iterDir => {
    const validationPath = path.join(iterDir, 'validation.json');
    if (pathExists(validationPath)) {
      try {
        const stats = fs.statSync(validationPath);
        validations.push({
          iteration: path.basename(iterDir),
          updatedAt: stats.mtime.toISOString(),
          relativePath: normalizePathForDisplay(path.relative(repoRoot, validationPath))
        });
      } catch {
        // ignore unreadable files
      }
    }
  });

  if (!validations.length) {
    return createArtifact({
      key: 'uiValidation',
      label: 'UI validation',
      status: 'missing',
      note: 'No validation.json artifacts found under self-iteration runs.'
    });
  }

  validations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const latest = validations[0];
  const note =
    validations.length > 1
      ? `Latest of ${validations.length} iterations (${latest.iteration}).`
      : `Iteration ${latest.iteration}.`;

  return createArtifact({
    key: 'uiValidation',
    label: 'UI validation',
    status: 'ready',
    path: latest.relativePath,
    updatedAt: latest.updatedAt,
    note
  });
}

function inspectUxReview(repoRoot, projectSlug) {
  if (!projectSlug) {
    return createArtifact({
      key: 'uxReview',
      label: 'UX review',
      status: 'missing',
      note: 'Provide --project <slug> to locate UX review outputs.'
    });
  }

  const reviewDirRelative = path.join('context', 'temp-agent-outputs', 'ux-review', projectSlug);
  const reviewDirAbsolute = path.resolve(repoRoot, reviewDirRelative);

  if (!pathExists(reviewDirAbsolute)) {
    return createArtifact({
      key: 'uxReview',
      label: 'UX review',
      status: 'missing',
      note: 'No UX review artifacts detected. Run /ux-review or npm run ux:review.'
    });
  }

  const jsonFiles = fs
    .readdirSync(reviewDirAbsolute)
    .filter(name => name.endsWith('.json'))
    .map(name => path.join(reviewDirAbsolute, name))
    .filter(entry => {
      try {
        return fs.statSync(entry).isFile();
      } catch {
        return false;
      }
    });

  if (!jsonFiles.length) {
    return createArtifact({
      key: 'uxReview',
      label: 'UX review',
      status: 'missing',
      note: 'JSON reviews not found. Run /ux-review before presenting variants.'
    });
  }

  jsonFiles.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  const latestPath = jsonFiles[0];
  const latestStats = fs.statSync(latestPath);

  let note = null;
  let markdownRelative = null;
  try {
    const raw = fs.readFileSync(latestPath, 'utf8');
    const report = JSON.parse(raw);
    const grade = Number(report?.grade?.overall);
    const passes = report?.passes === true || (typeof grade === 'number' && !Number.isNaN(grade) && grade >= 80);
    if (!Number.isNaN(grade)) {
      note = `Latest grade ${grade.toFixed(1)} (${passes ? 'passes' : 'needs follow-up'})`;
    } else if (passes) {
      note = 'Latest review passes threshold.';
    }
    const variantKey = report?.variant || path.basename(latestPath, '.json');
    const markdownCandidate = path.join(reviewDirAbsolute, `${variantKey}.md`);
    if (pathExists(markdownCandidate)) {
      markdownRelative = path.relative(repoRoot, markdownCandidate);
    }
  } catch {
    // ignore JSON parse failures for summary
  }

  const extraPaths = {};
  if (markdownRelative) {
    extraPaths.markdown = markdownRelative;
  }

  return createArtifact({
    key: 'uxReview',
    label: 'UX review',
    status: 'ready',
    path: path.relative(repoRoot, latestPath),
    updatedAt: latestStats.mtime.toISOString(),
    note,
    extraPaths
  });
}

function getFileInfo(repoRoot, relativePath, options = {}) {
  if (!relativePath) return null;

  let absolutePath = null;
  if (path.isAbsolute(relativePath)) {
    absolutePath = relativePath;
  } else {
    const { projectSlug } = options;
    if (projectSlug) {
      const candidate = projectPath(relativePath, projectSlug);
      if (pathExists(candidate)) {
        absolutePath = candidate;
      }
    }

    if (!absolutePath) {
      const fallback = path.resolve(repoRoot, relativePath);
      if (pathExists(fallback)) {
        absolutePath = fallback;
      }
    }
  }

  if (!absolutePath || !pathExists(absolutePath)) return null;
  const stats = fs.statSync(absolutePath);
  return {
    absolutePath,
    relativePath: normalizePathForDisplay(path.relative(repoRoot, absolutePath)),
    updatedAt: stats.mtime.toISOString(),
    size: stats.size
  };
}

function createArtifact({ key, label, status, path, updatedAt, note, extraPaths }) {
  const normalizedExtra = {};
  if (extraPaths) {
    Object.entries(extraPaths).forEach(([extraKey, value]) => {
      if (value) {
        normalizedExtra[extraKey] = normalizePathForDisplay(value);
      }
    });
  }

  return {
    key,
    label,
    status,
    path: path ? normalizePathForDisplay(path) : null,
    updatedAt,
    note: note || null,
    extraPaths: Object.keys(normalizedExtra).length ? normalizedExtra : undefined
  };
}

function normalizePathForDisplay(relativePath) {
  if (!relativePath) return null;
  return relativePath.split(path.sep).join('/');
}

function computeOpenTasks(snapshot) {
  const tasks = [];
  const projectSlug = snapshot.projectSlug;

  if (!projectSlug) {
    tasks.push({
      message: 'Project slug not detected. Provide --project <slug> (or rerun /start with --project) before proceeding.'
    });
    return tasks;
  }

  const businessContextStatus = snapshot.artifacts.businessContext;
  if (businessContextStatus) {
    if (
      (businessContextStatus.status === 'stale' || businessContextStatus.status === 'missing') &&
      businessContextStatus.extraPaths?.source
    ) {
      tasks.push({
        message: 'Export business context JSON (run npm run export:business-context).'
      });
    }
  }

  const briefStatus = snapshot.artifacts.briefAnalysis?.status || 'missing';
  const strategyStatus = snapshot.artifacts.strategy?.status || 'missing';
  const validationStatus = snapshot.artifacts.metadataValidation?.status || 'missing';

  if (briefStatus !== 'ready') {
    tasks.push({ message: 'Generate brief analysis via /analyze.' });
  }

  if (briefStatus === 'ready' && strategyStatus !== 'ready') {
    tasks.push({ message: 'Create wireframe strategy via /strategize.' });
  }

  if (briefStatus === 'ready' && strategyStatus === 'ready' && validationStatus !== 'ready') {
    tasks.push({ message: 'Run /validate --metadata --context once build updates are in place.' });
  }

  if (snapshot.pendingAgents?.length) {
    tasks.push({
      message: `Pending agents recorded in workflow state: ${snapshot.pendingAgents.join(', ')}`
    });
  }

  if (snapshot.errors?.length) {
    snapshot.errors.forEach(err => {
      const agent = err.agentName || 'unknown agent';
      const message = err.error || 'unresolved error';
      tasks.push({ message: `Fix error for ${agent}: ${message}` });
    });
  }

  const uxReviewStatus = snapshot.artifacts.uxReview;
  if (!uxReviewStatus || uxReviewStatus.status === 'missing') {
    tasks.push({ message: 'Run /ux-review (or npm run ux:review) to log UX feedback for the latest build.' });
  } else if (typeof uxReviewStatus.note === 'string' && uxReviewStatus.note.includes('needs follow-up')) {
    tasks.push({ message: 'Address open UX review findings (see context/temp-agent-outputs/ux-review/).' });
  }

  return tasks;
}

function determineNextSteps(snapshot) {
  const steps = [];
  const projectSlug = snapshot.projectSlug;

  if (!projectSlug) {
    pushStep(steps, '/start --project <slug>', 'Set the project slug so prompts and CLI can locate artifacts.');
    pushStep(
      steps,
      'npm run orchestrate -- --project <slug> --brief <path>',
      'Initialize the orchestrator with an intake source to generate brief-analysis outputs.'
    );
    return steps;
  }

  const briefStatus = snapshot.artifacts.briefAnalysis?.status || 'missing';
  const strategyStatus = snapshot.artifacts.strategy?.status || 'missing';
  const validationStatus = snapshot.artifacts.metadataValidation?.status || 'missing';
  const uiStatus = snapshot.artifacts.uiValidation?.status || 'missing';
  const uxReviewStatus = snapshot.artifacts.uxReview?.status || 'missing';
  const businessContextStatus = snapshot.artifacts.businessContext?.status || 'missing';
  const needsBusinessContextExport =
    snapshot.artifacts.businessContext?.extraPaths?.source &&
    (businessContextStatus === 'stale' || businessContextStatus === 'missing');

  if (needsBusinessContextExport) {
    pushStep(
      steps,
      'npm run export:business-context',
      'Refresh business-context.json so validators use the latest Markdown source.'
    );
  }

  if (briefStatus !== 'ready') {
    pushStep(
      steps,
      `/analyze --project ${projectSlug} --brief <path>`,
      'Create structured brief analysis to unlock downstream strategy prompts.'
    );
  } else if (strategyStatus !== 'ready') {
    pushStep(
      steps,
      `/strategize --project ${projectSlug}`,
      'Generate differentiated variant plans before building page templates.'
    );
  } else if (validationStatus !== 'ready') {
    pushStep(
      steps,
      `/validate --project ${projectSlug} --metadata --context`,
      'Validate metadata and business context alignment after implementing build updates.'
    );
    if (!needsBusinessContextExport && uiStatus !== 'ready') {
      pushStep(
        steps,
        `/validate --project ${projectSlug} --ui --dom <path> --screenshot <path>`,
        'Optional: add UI validation once DOM snapshots and screenshots are available.'
      );
    }
  } else if (uxReviewStatus !== 'ready') {
    pushStep(
      steps,
      `npm run ux:review -- --project ${projectSlug} --variant <key>`,
      'Grade each built variant (replace <key> with option-a, option-b, etc.) and log findings.'
    );
  } else {
    pushStep(
      steps,
      `/export --project ${projectSlug}`,
      'Package artifacts for handoff and optional Lovable export.'
    );
  }

  pushStep(
    steps,
    'npm run orchestrate --status',
    'Re-run the status check after taking action to confirm remaining tasks.'
  );

  return steps;
}

function pushStep(steps, command, detail) {
  if (!steps.some(entry => entry.command === command)) {
    steps.push({ command, detail });
  }
}

function formatArtifactStatus(status) {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'stale':
      return 'Stale';
    case 'partial':
      return 'Partial';
    case 'missing':
    default:
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  }
}

function printWorkflowGuide(repoRoot) {
  console.log('\nWorkflow Guide (from context/cli-experience-blueprint.md)');
  const blueprintPath = path.resolve(repoRoot, BLUEPRINT_RELATIVE);
  if (!pathExists(blueprintPath)) {
    console.log('- Blueprint file not found.');
    return;
  }

  let markdown = '';
  try {
    markdown = fs.readFileSync(blueprintPath, 'utf8');
  } catch (error) {
    console.log(`- Unable to read blueprint: ${error.message}`);
    return;
  }

  const guide = extractGuideSections(markdown);
  if (guide.overview.length) {
    console.log('\nSession Overview Layer:');
    guide.overview.forEach(line => {
      const segments = line.split('\n');
      segments.forEach((segment, index) => {
        if (index === 0) {
          console.log(`  - ${segment}`);
        } else {
          console.log(`    ${segment.trimStart()}`);
        }
      });
    });
  } else {
    console.log('\nSession Overview Layer: (not found)');
  }

  if (guide.phases.length) {
    console.log('\nPhase Blueprint:');
    guide.phases.forEach(phase => {
      console.log(`- ${phase.title}`);
      phase.bullets.forEach(bullet => {
        const segments = bullet.split('\n');
        segments.forEach((segment, index) => {
          if (index === 0) {
            console.log(`    • ${segment}`);
          } else {
            console.log(`      ${segment.trimStart()}`);
          }
        });
      });
    });
  } else {
    console.log('\nPhase Blueprint: (not found)');
  }
  console.log('');
}

function extractGuideSections(markdown) {
  const lines = markdown.split('\n');
  const overview = [];
  const phases = [];

  let mode = null;
  let currentPhase = null;

  lines.forEach(line => {
    if (line.startsWith('## 1. ')) {
      mode = 'overview';
      currentPhase = null;
      return;
    }
    if (line.startsWith('## 2. ')) {
      mode = 'phases';
      currentPhase = null;
      return;
    }
    if (line.startsWith('## ') && !line.startsWith('## 1. ') && !line.startsWith('## 2. ')) {
      mode = null;
      currentPhase = null;
      return;
    }

    if (mode === 'overview') {
      if (line.startsWith('- ')) {
        overview.push(line.slice(2).trim());
        return;
      }
      if (line.startsWith('  - ') && overview.length) {
        overview[overview.length - 1] += `\n      • ${line.slice(4).trim()}`;
      }
      return;
    }

    if (mode === 'phases') {
      if (line.startsWith('### ')) {
        currentPhase = { title: line.replace(/^###\s*/, '').trim(), bullets: [] };
        phases.push(currentPhase);
        return;
      }
      if (currentPhase && line.startsWith('- ')) {
        currentPhase.bullets.push(line.slice(2).trim());
        return;
      }
      if (currentPhase && line.startsWith('  - ') && currentPhase.bullets.length) {
        const idx = currentPhase.bullets.length - 1;
        currentPhase.bullets[idx] += `\n      • ${line.slice(4).trim()}`;
      }
    }
  });

  return { overview, phases };
}

function deriveInitialPendingAgents(options) {
  const allAgents = flattenSequence();
  if (options.skipBusinessContext && !options.forceBusinessContext) {
    return allAgents.filter(name => name !== 'business-context-gatherer');
  }
  return allAgents;
}

async function orchestrateWorkflow(initialState, platformInfo, cliOptions) {
  let state = initialState;

  if (state.status === 'completed') {
    console.log(`Workflow ${state.workflowId} already completed.`);
    return state;
  }

  // Auto-snapshot project before agent workflow begins
  const isFirstRun = !(state.completedAgents && state.completedAgents.length > 0);
  if (isFirstRun && state.projectSlug) {
    await createAutoSnapshot(state.projectSlug, `Before orchestrator workflow ${state.workflowId}`);
  }

  for (const phaseEntry of AGENT_SEQUENCE) {
    const phase = phaseEntry.phase;
    state = updatePhase(state, phase);
    await saveState(repoRoot, state, { project: state?.projectSlug });

    for (const agentName of phaseEntry.agents) {
      const info = getAgentInfo(agentName);
      if (!info) continue;

      const alreadyDone = (state.completedAgents || []).some(item => item.name === agentName);
      if (alreadyDone) continue;

      const shouldSkip = evaluateSkip(agentName, state, cliOptions);
      if (shouldSkip.skip) {
        const skippedAgents = state.metadata?.skippedAgents || [];
        if (!skippedAgents.some(item => item.name === agentName)) {
          state = setMetadata(state, {
            skippedAgents: [...skippedAgents, { name: agentName, reason: shouldSkip.reason }]
          });
        }
        state = setPendingAgents(state, (state.pendingAgents || []).filter(name => name !== agentName));
        await saveState(repoRoot, state, { project: state?.projectSlug });
        console.log(`- Skipping ${agentName}: ${shouldSkip.reason}`);
        continue;
      }

      const outputsReady = await checkOutputs(agentName, state.projectSlug);
      if (!outputsReady) {
        const mergedOptions = getMergedOptions(state, cliOptions);
        let promptPath = null;
        if (mergedOptions.preparePrompts) {
          try {
            promptPath = prepareAgentPromptFile({
              agentName,
              projectSlug: state.projectSlug
            });
            console.log(`> Prepared prompt template at ${path.relative(repoRoot, promptPath)}`);
          } catch (error) {
            console.warn(`! Unable to prepare prompt for ${agentName}: ${error.message}`);
          }
        }
        await saveState(repoRoot, state, { project: state?.projectSlug });
        printAgentAction(agentName, platformInfo, {
          projectSlug: state.projectSlug,
          promptPath,
          options: mergedOptions
        });
        process.exit(2);
      }

      const validation = await validateAgentOutputs(agentName, repoRoot, state.projectSlug);
      if (!validation.valid) {
        const errorPayload = {
          agentName,
          timestamp: new Date().toISOString(),
          error: `Validation failed: ${validation.issues.join(', ')}`,
          validationFailures: validation.issues
        };
        state = pushError(state, errorPayload);
        state = markStatus(state, 'validation_failed');
        await saveState(repoRoot, state, { project: state?.projectSlug });
        console.error(`! Validation failed for ${agentName}: ${validation.issues.join(', ')}`);
        process.exit(3);
      }

      const primaryOutput = info.outputs.find(output => output.required) || info.outputs[0];
      const entry = {
        name: agentName,
        completedAt: new Date().toISOString(),
        outputPath: primaryOutput ? primaryOutput.path : null,
        success: true,
        validationPassed: true
      };

      state = appendCompletedAgent(state, entry);
      if (agentName === 'business-context-gatherer') {
        state.contextFiles = {
          ...(state.contextFiles || {}),
          businessContext: projectPath('context/BUSINESS-CONTEXT.md', state.projectSlug)
        };
      }
      if (agentName === 'brief-analyzer') {
        state.contextFiles = {
          ...(state.contextFiles || {}),
          briefAnalysis: projectPath(
            'context/temp-agent-outputs/brief-analysis.json',
            state.projectSlug
          )
        };
      }
      state = markStatus(state, 'in_progress');
      await saveState(repoRoot, state, { project: state?.projectSlug });

      if (agentName === 'brief-analyzer') {
        state = await handleEnrichmentDecisions(state, cliOptions);
        await saveState(repoRoot, state, { project: state?.projectSlug });
      }
    }
  }

  state = markComplete(state);
  await saveState(repoRoot, state, { project: state?.projectSlug });

  console.log(`✅ Workflow ${state.workflowId} completed.`);
  const finalPromptAbsolute = projectPath(
    'context/temp-agent-outputs/final-prompt.md',
    state.projectSlug
  );
  console.log(
    `Final prompt available at ${path.relative(repoRoot, finalPromptAbsolute)}`
  );
  return state;
}

function evaluateSkip(agentName, state, cliOptions) {
  const merged = getMergedOptions(state, cliOptions);

  if (agentName === 'business-context-gatherer') {
    if (merged.skipBusinessContext && !merged.forceBusinessContext) {
      return { skip: true, reason: 'skip flag set for business context' };
    }
    if (state.contextFiles?.businessContext && !merged.forceBusinessContext) {
      return { skip: true, reason: 'existing business context detected' };
    }
  }

  if (agentName === 'visual-ux-advisor') {
    if (merged.skipVisual && !merged.forceVisual) {
      return { skip: true, reason: 'skip flag set for visual agent' };
    }
    if (state.metadata?.enrichmentDecisions?.visual === 'skip') {
      return { skip: true, reason: 'visual score above threshold' };
    }
  }

  if (agentName === 'variant-differentiator') {
    if (merged.skipVariant && !merged.forceVariant) {
      return { skip: true, reason: 'skip flag set for variant agent' };
    }
    if (state.metadata?.enrichmentDecisions?.variant === 'skip') {
      return { skip: true, reason: 'variant score above threshold' };
    }
  }

  return { skip: false };
}

async function checkOutputs(agentName, projectSlug) {
  const info = getAgentInfo(agentName);
  if (!info) return false;
  return info.outputs.every(output =>
    pathExists(projectPath(output.path, projectSlug))
  );
}

function printAgentAction(agentName, platformInfo, { projectSlug, promptPath, options } = {}) {
  const info = getAgentInfo(agentName);
  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Next agent: ${info?.label || agentName}`);
  console.log(`Platform detected: ${platformInfo.platform}`);
  if (platformInfo.capabilities.parallelExecution) {
    console.log('Note: Parallel execution supported. You can prepare other enrichment agents concurrently.');
  }
  console.log('\nExpected outputs:');
  info.outputs.forEach(output => {
    console.log(`  • ${output.path}${output.required ? ' (required)' : ''}`);
  });
  console.log(`\nReference: ${info.documentation}`);
  console.log('Run instructions:');
  console.log(`  1. Consult AGENT-WORKFLOWS.md for the agent prompt.`);
  console.log(`  2. Generate output and write to the paths listed above.`);
  console.log(`  3. Re-run this orchestrator script to continue.`);
  console.log('Tip: node packages/wireframe-core/scripts/orchestrator.mjs --agent-help ' + agentName);
  const commandParts = ['node packages/wireframe-core/scripts/agents/run-agent.mjs', '--agent', agentName];
  if (projectSlug) {
    commandParts.push('--project', projectSlug);
  }
  commandParts.push('--write');
  console.log(`Command template: ${commandParts.join(' ')}`);

  if (promptPath) {
    console.log(`Prompt template ready at ${path.relative(repoRoot, promptPath)}`);
  } else if (options?.preparePrompts) {
    console.log('Prompt preparation was requested but the template could not be created automatically.');
  }
  console.log('────────────────────────────────────────────────────────\n');
}

function getMergedOptions(state, cliOptions) {
  return { ...(state.metadata?.options || {}), ...(cliOptions || {}) };
}

async function handleEnrichmentDecisions(state, cliOptions) {
  if (state?.metadata?.enrichmentDecisions?.computed) {
    return state;
  }

  const analysisPath = projectPath(
    'context/temp-agent-outputs/brief-analysis.json',
    state.projectSlug
  );
  if (!pathExists(analysisPath)) {
    return state;
  }

  const briefAnalysis = await readJson(analysisPath);
  const visualResult = computeVisualScore(briefAnalysis);
  const variantResult = computeVariantScore(briefAnalysis);

  const merged = getMergedOptions(state, cliOptions);

  const visualThreshold = 3;
  const variantThreshold = 3;

  let visualDecision = visualResult.score < visualThreshold ? 'run' : 'skip';
  let variantDecision = variantResult.score < variantThreshold ? 'run' : 'skip';

  if (merged.forceVisual) visualDecision = 'run';
  if (merged.skipVisual) visualDecision = 'skip';
  if (merged.forceVariant) variantDecision = 'run';
  if (merged.skipVariant) variantDecision = 'skip';

  const enrichmentDecisions = {
    computed: true,
    visual: visualDecision,
    variant: variantDecision,
    visualScore: visualResult.score,
    visualReasons: visualResult.reasons,
    variantScore: variantResult.score,
    variantReasons: variantResult.reasons
  };

  let stateWithMetadata = setMetadata(state, { enrichmentDecisions });

  const filteredPending = (stateWithMetadata.pendingAgents || []).filter(name => {
    if (name === 'visual-ux-advisor' && enrichmentDecisions.visual === 'skip') {
      return false;
    }
    if (name === 'variant-differentiator' && enrichmentDecisions.variant === 'skip') {
      return false;
    }
    return true;
  });

  stateWithMetadata = setPendingAgents(stateWithMetadata, filteredPending);

  return stateWithMetadata;
}

function resolveUxReviewPaths(projectSlug, variant) {
  const safeVariant = variant || 'index';
  const reviewDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'ux-review',
    projectSlug
  );
  const jsonPath = path.join(reviewDir, `${safeVariant}.json`);
  const markdownPath = path.join(reviewDir, `${safeVariant}.md`);
  return { reviewDir, jsonPath, markdownPath };
}

async function handleUxReviewAfterWorkflow(state, cliOptions) {
  if (!cliOptions?.uxReview) {
    return;
  }

  const projectSlug = state?.projectSlug;
  if (!projectSlug) {
    console.warn('> UX review flag set, but project slug is unavailable. Re-run with --project <slug>.');
    return;
  }

  const variant = cliOptions.uxReviewVariant || 'index';
  const paths = resolveUxReviewPaths(projectSlug, variant);
  ensureDir(paths.reviewDir);

  const relativeJson = path.relative(repoRoot, paths.jsonPath);
  const relativeMarkdown = path.relative(repoRoot, paths.markdownPath);

  if (!pathExists(paths.jsonPath)) {
    console.log('\n──────────────── UX Review ────────────────');
    console.log(`No UX review JSON detected for ${projectSlug}/${variant}.`);
    console.log(`Run: npm run ux:review -- --project ${projectSlug} --variant ${variant}`);
    console.log('Optional flags: --dom <path>, --screenshot <path>, --change-log <path>');
    console.log(`Expected outputs:`);
    console.log(`  • JSON → ${relativeJson}`);
    console.log(`  • Markdown → ${relativeMarkdown}`);
    console.log('───────────────────────────────────────────\n');
    return;
  }

  try {
    const report = await readJson(paths.jsonPath);
    const grade = Number(report?.grade?.overall);
    const passes = report?.passes === true || (typeof grade === 'number' && !Number.isNaN(grade) && grade >= 80);
    const gradeText = Number.isFinite(grade) ? grade.toFixed(1) : 'n/a';
    console.log('\n──────────────── UX Review ────────────────');
    console.log(`Variant: ${projectSlug}/${variant}`);
    console.log(`Overall grade: ${gradeText} (${passes ? 'passes' : 'needs follow-up'})`);
    if (Array.isArray(report?.nextActions) && report.nextActions.length) {
      console.log('Next actions:');
      report.nextActions.slice(0, 3).forEach(action => {
        console.log(`  • ${action}`);
      });
      if (report.nextActions.length > 3) {
        console.log(`  • …and ${report.nextActions.length - 3} more`);
      }
    }
    console.log(`JSON: ${relativeJson}`);
    if (pathExists(paths.markdownPath)) {
      console.log(`Markdown: ${relativeMarkdown}`);
    }
    console.log('───────────────────────────────────────────\n');
  } catch (error) {
    console.warn('\n──────────────── UX Review ────────────────');
    console.warn(`Unable to read ${relativeJson}: ${error.message}`);
    console.warn('───────────────────────────────────────────\n');
  }
}

main().catch(error => {
  console.error('Unhandled error in orchestrator:', error);
  process.exit(1);
});
