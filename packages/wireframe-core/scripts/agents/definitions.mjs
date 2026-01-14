import path from 'path';

/**
 * Centralized path constants for agent outputs and context files.
 * Single source of truth - orchestrator and other scripts should import from here.
 */
const TEMP_AGENT_OUTPUTS = path.join('context', 'temp-agent-outputs');

export const PATHS = {
  // Base directories
  TEMP_AGENT_OUTPUTS,
  SELF_ITERATION: path.join(TEMP_AGENT_OUTPUTS, 'self-iteration'),
  UX_REVIEW: path.join(TEMP_AGENT_OUTPUTS, 'ux-review'),
  PROMPTS: path.join(TEMP_AGENT_OUTPUTS, 'prompts'),

  // Workflow state
  WORKFLOW_STATE: path.join(TEMP_AGENT_OUTPUTS, 'workflow-state.json'),

  // Business context
  BUSINESS_CONTEXT_MD: path.join('context', 'BUSINESS-CONTEXT.md'),
  BUSINESS_CONTEXT_JSON: path.join(TEMP_AGENT_OUTPUTS, 'business-context.json'),
  BUSINESS_CONTEXT_VALIDATION: path.join(TEMP_AGENT_OUTPUTS, 'business-context-validation.json'),
  BUSINESS_CONTEXT_VALIDATION_MD: path.join(TEMP_AGENT_OUTPUTS, 'business-context-validation.md'),

  // Brief analysis
  BRIEF_ANALYSIS: path.join(TEMP_AGENT_OUTPUTS, 'brief-analysis.json'),
  BRIEF_ANALYSIS_SUMMARY: path.join(TEMP_AGENT_OUTPUTS, 'brief-analysis-summary.md'),

  // Strategy
  WIREFRAME_STRATEGY: path.join(TEMP_AGENT_OUTPUTS, 'wireframe-strategy.json'),
  WIREFRAME_STRATEGY_SUMMARY: path.join(TEMP_AGENT_OUTPUTS, 'wireframe-strategy-summary.md'),

  // Enrichment
  VISUAL_GUIDANCE: path.join(TEMP_AGENT_OUTPUTS, 'visual-guidance.json'),
  VARIANT_STRATEGY: path.join(TEMP_AGENT_OUTPUTS, 'variant-strategy.json'),

  // Generation
  FINAL_PROMPT: path.join(TEMP_AGENT_OUTPUTS, 'final-prompt.md'),

  // Alternate workflows
  TRANSCRIBE: path.join(TEMP_AGENT_OUTPUTS, 'transcribe.json'),
  ITERATE_PLAN: path.join(TEMP_AGENT_OUTPUTS, 'iterate-plan.json'),

  // Other context
  BLUEPRINT: path.join('context', 'cli-experience-blueprint.md')
};

export const AGENT_SEQUENCE = [
  {
    phase: 'context',
    agents: ['business-context-gatherer']
  },
  {
    phase: 'analysis',
    agents: ['brief-analyzer']
  },
  {
    phase: 'enrichment',
    agents: ['visual-ux-advisor', 'variant-differentiator']
  },
  {
    phase: 'strategy',
    agents: ['wireframe-strategist']
  },
  {
    phase: 'alignment',
    agents: ['business-context-validator']
  },
  {
    phase: 'generation',
    agents: ['prompt-generator']
  }
];

export const AGENT_METADATA = {
  'business-context-gatherer': {
    label: 'Business Context Gatherer',
    description: 'Captures strategic intelligence for new wireframe projects.',
    required: false,
    // No dependencies - first agent in workflow
    dependencies: [],
    inputs: [],
    outputs: [
      { path: PATHS.BUSINESS_CONTEXT_MD, type: 'markdown', required: true, minBytes: 200 },
      {
        path: PATHS.BUSINESS_CONTEXT_JSON,
        type: 'json',
        required: true,
        requiredKeys: ['strategicGoals.shortTerm', 'targetAudiences']
      }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-0-business-context-gatherer'
  },
  'brief-analyzer': {
    label: 'Brief Analyzer',
    description: 'Transforms the design brief into structured requirements.',
    required: true,
    // Depends on business context (if available)
    dependencies: [],
    optionalDependencies: ['business-context-gatherer'],
    inputs: [
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false }
    ],
    outputs: [
      { path: PATHS.BRIEF_ANALYSIS, type: 'json', required: true, requiredKeys: ['projectOverview', 'sectionStructure', 'contentRequirements', 'routingInputs'] },
      { path: PATHS.BRIEF_ANALYSIS_SUMMARY, type: 'markdown', required: false, minBytes: 120 }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-1-brief-analyzer'
  },
  'visual-ux-advisor': {
    label: 'Visual UX Advisor',
    description: 'Recommends layout and interaction guidance when requests lack detail.',
    required: false,
    dependencies: ['brief-analyzer'],
    inputs: [
      { path: PATHS.BRIEF_ANALYSIS, required: true },
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false }
    ],
    outputs: [
      { path: PATHS.VISUAL_GUIDANCE, type: 'json', required: true }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-4-visual-ux-advisor'
  },
  'variant-differentiator': {
    label: 'Variant Differentiator',
    description: 'Defines hypotheses and differentiators for each variant.',
    required: false,
    dependencies: ['brief-analyzer'],
    inputs: [
      { path: PATHS.BRIEF_ANALYSIS, required: true },
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false }
    ],
    outputs: [
      { path: PATHS.VARIANT_STRATEGY, type: 'json', required: true }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-5-variant-differentiator'
  },
  'wireframe-strategist': {
    label: 'Wireframe Strategist',
    description: 'Synthesizes analysis into variant-specific layout strategies.',
    required: true,
    dependencies: ['brief-analyzer'],
    optionalDependencies: ['visual-ux-advisor', 'variant-differentiator'],
    inputs: [
      { path: PATHS.BRIEF_ANALYSIS, required: true },
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false },
      { path: PATHS.VISUAL_GUIDANCE, required: false },
      { path: PATHS.VARIANT_STRATEGY, required: false }
    ],
    outputs: [
      { path: PATHS.WIREFRAME_STRATEGY, type: 'json', required: true }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-2-wireframe-strategist'
  },
  'business-context-validator': {
    label: 'Business Context Validator',
    description: 'Checks variant plans against business goals/personas and flags misalignment.',
    required: false,
    dependencies: ['wireframe-strategist'],
    inputs: [
      { path: PATHS.WIREFRAME_STRATEGY, required: true },
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: true }
    ],
    outputs: [
      { path: PATHS.BUSINESS_CONTEXT_VALIDATION, type: 'json', required: true },
      { path: PATHS.BUSINESS_CONTEXT_VALIDATION_MD, type: 'markdown', required: false, minBytes: 120 }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-6-business-context-validator'
  },
  'wireframe-validator': {
    label: 'Wireframe Validator',
    description: 'Grades generated wireframes against the brief, metadata, and accessibility checklist.',
    required: false,
    dependencies: ['wireframe-strategist'],
    inputs: [
      { path: PATHS.BRIEF_ANALYSIS, required: true },
      { path: PATHS.WIREFRAME_STRATEGY, required: false }
    ],
    outputs: [
      {
        path: `${PATHS.SELF_ITERATION}/<slug>/iteration-*/validation.json`,
        type: 'json',
        required: true,
        requiredKeys: ['valid', 'issues', 'summary']
      },
      {
        path: `${PATHS.SELF_ITERATION}/<slug>/iteration-*/validation.md`,
        type: 'markdown',
        required: false,
        minBytes: 120
      }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-7-wireframe-validator'
  },
  'prompt-generator': {
    label: 'Prompt Generator',
    description: 'Produces the final LLM-ready prompt for code generation.',
    required: true,
    dependencies: ['wireframe-strategist'],
    optionalDependencies: ['business-context-validator'],
    inputs: [
      { path: PATHS.BRIEF_ANALYSIS, required: true },
      { path: PATHS.WIREFRAME_STRATEGY, required: true },
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false },
      { path: PATHS.VISUAL_GUIDANCE, required: false },
      { path: PATHS.BUSINESS_CONTEXT_VALIDATION, required: false }
    ],
    outputs: [
      { path: PATHS.FINAL_PROMPT, type: 'markdown', required: true, minBytes: 200 }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-3-prompt-generator'
  },
  'wireframe-transcriber': {
    label: 'Wireframe Transcriber',
    description: 'Normalize an existing page into the universal wireframe section map.',
    required: false,
    // Alternate workflow - no standard dependencies
    dependencies: [],
    inputs: [],
    outputs: [
      { path: PATHS.TRANSCRIBE, type: 'json', required: true }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-wireframe-transcriber'
  },
  'wireframe-iter': {
    label: 'Wireframe Iteration Planner',
    description: 'Generate a delta plan and proposed updated metadata for iteration.',
    required: false,
    // Alternate workflow - no standard dependencies
    dependencies: [],
    inputs: [],
    outputs: [
      { path: PATHS.ITERATE_PLAN, type: 'json', required: true }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-wireframe-iter'
  },
  'ux-review': {
    label: 'UX Review',
    description: 'Grades a built variant against UX heuristics and stated goals, emitting actionable feedback.',
    required: false,
    dependencies: [],
    inputs: [
      { path: PATHS.BUSINESS_CONTEXT_JSON, required: false }
    ],
    outputs: [
      { path: `${PATHS.UX_REVIEW}/<project>/<variant>.json`, type: 'json', required: true },
      { path: `${PATHS.UX_REVIEW}/<project>/<variant>.md`, type: 'markdown', required: false, minBytes: 60 }
    ],
    documentation: 'AGENT-WORKFLOWS.md#agent-8-ux-review'
  }
};

/**
 * Get required input files for an agent.
 * @param {string} agentName
 * @returns {Array<{path: string, required: boolean}>}
 */
export function getAgentInputs(agentName) {
  const info = AGENT_METADATA[agentName];
  return info?.inputs || [];
}

/**
 * Get dependencies (agents that must complete before this one).
 * @param {string} agentName
 * @returns {{required: string[], optional: string[]}}
 */
export function getAgentDependencies(agentName) {
  const info = AGENT_METADATA[agentName];
  return {
    required: info?.dependencies || [],
    optional: info?.optionalDependencies || []
  };
}

export function listAgents() {
  return Object.keys(AGENT_METADATA);
}

export function getAgentInfo(name) {
  return AGENT_METADATA[name] || null;
}

export function getAgentsForPhase(phase) {
  const entry = AGENT_SEQUENCE.find(item => item.phase === phase);
  return entry ? entry.agents : [];
}

export function flattenSequence() {
  return AGENT_SEQUENCE.flatMap(item => item.agents);
}
