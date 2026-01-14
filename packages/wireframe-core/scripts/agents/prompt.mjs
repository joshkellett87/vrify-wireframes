import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ensureDir } from './fs-utils.mjs';
import { getAgentInfo } from './definitions.mjs';
import { resolveProjectPath, resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);
const workflowsPath = path.resolve(repoRoot, 'AGENT-WORKFLOWS.md');

// Cache for AGENT-WORKFLOWS.md content to avoid repeated file reads
// when generating multiple prompts in a single session
let cachedWorkflows = null;

function readWorkflows() {
  if (cachedWorkflows) return cachedWorkflows;

  try {
    cachedWorkflows = fs.readFileSync(workflowsPath, 'utf8');
    return cachedWorkflows;
  } catch (error) {
    throw new Error(`Unable to read AGENT-WORKFLOWS.md: ${error.message}`);
  }
}

/**
 * Clear the cached workflows content.
 * Useful for testing or when the file has been modified during a session.
 */
export function clearWorkflowCache() {
  cachedWorkflows = null;
}

function findAgentSection(content, agentName) {
  const sectionRegex = /###\s+Agent(?:\s+\d+)?:[\s\S]*?(?=###\s+Agent(?:\s+\d+)?:|$)/g;
  const sections = content.match(sectionRegex) || [];

  for (const section of sections) {
    const nameMatch = section.match(/\*\*1\) name\*\*\s*`([^`]+)`/i);
    if (nameMatch && nameMatch[1].trim() === agentName) {
      return section;
    }
  }
  return null;
}

export function getAgentPrompt(agentName) {
  const info = getAgentInfo(agentName);
  if (!info) {
    throw new Error(`Unknown agent: ${agentName}`);
  }

  const content = readWorkflows();
  const section = findAgentSection(content, agentName);
  if (!section) {
    throw new Error(`Prompt not found for agent: ${agentName}`);
  }

  const promptMatch = section.match(/```prompt\n([\s\S]*?)```/i);
  if (!promptMatch) {
    throw new Error(`Prompt block not found for agent: ${agentName}`);
  }

  const descriptionMatch = section.match(/\*\*2\) description\*\*\n([^]*?)\n\n/);
  const description = descriptionMatch ? descriptionMatch[1].trim() : info.description;

  return {
    agent: agentName,
    label: info.label,
    description,
    prompt: promptMatch[1].trim(),
    outputs: info.outputs || []
  };
}

export function prepareAgentPromptFile({ agentName, projectSlug }) {
  const { label, prompt } = getAgentPrompt(agentName);
  const promptsDir = resolveProjectPath(
    import.meta.url,
    'context/temp-agent-outputs/prompts',
    { project: projectSlug }
  );
  ensureDir(promptsDir);

  const slugPrefix = projectSlug ? `${projectSlug}-` : '';
  const fileName = `${slugPrefix}${agentName}.prompt.md`;
  const promptPath = path.join(promptsDir, fileName);

  const contents = `# ${label} Prompt\n\n\`\`\`prompt\n${prompt}\n\`\`\`\n`;
  fs.writeFileSync(promptPath, contents, 'utf8');

  return promptPath;
}

export { repoRoot };
