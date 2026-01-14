import path from "path";
import { ensureDir, pathExists, readJson, writeJson } from "./fs-utils.mjs";
import { resolveProjectPath } from "../utils/path-helpers.mjs";

const OUTPUT_DIR = "context/temp-agent-outputs";
const STATE_FILE = "workflow-state.json";

// Pending state for batch persistence - reduces I/O during rapid state updates
let pendingState = null;
let pendingStateOptions = null;

export function getStatePath(repoRoot, options = {}) {
  const stateDir = resolveProjectPath(import.meta.url, OUTPUT_DIR, {
    project: options.project,
  });
  return path.resolve(stateDir, STATE_FILE);
}

export async function loadState(repoRoot, options = {}) {
  const statePath = getStatePath(repoRoot, options);
  if (!pathExists(statePath)) return null;
  return await readJson(statePath);
}

/**
 * Save workflow state to disk.
 * @param {string} repoRoot
 * @param {object} state
 * @param {object} options
 * @param {string} [options.project] - Project slug for path resolution
 * @param {boolean} [options.immediate=true] - If false, defer write until flushState() is called
 */
export async function saveState(repoRoot, state, options = {}) {
  const { immediate = true, ...pathOptions } = options;

  if (!immediate) {
    // Store for later flush
    pendingState = state;
    pendingStateOptions = { repoRoot, ...pathOptions };
    return;
  }

  const dir = resolveProjectPath(import.meta.url, OUTPUT_DIR, {
    project: pathOptions.project,
  });
  ensureDir(dir);
  await writeJson(path.join(dir, STATE_FILE), state);

  // Clear pending state since we just wrote
  pendingState = null;
  pendingStateOptions = null;
}

/**
 * Flush any pending state to disk.
 * Call this at phase boundaries or before process exit.
 * @returns {Promise<boolean>} true if state was flushed, false if nothing pending
 */
export async function flushState() {
  if (!pendingState || !pendingStateOptions) {
    return false;
  }

  const { repoRoot, ...pathOptions } = pendingStateOptions;
  const dir = resolveProjectPath(import.meta.url, OUTPUT_DIR, {
    project: pathOptions.project,
  });
  ensureDir(dir);
  await writeJson(path.join(dir, STATE_FILE), pendingState);

  pendingState = null;
  pendingStateOptions = null;
  return true;
}

/**
 * Check if there's pending unsaved state.
 * @returns {boolean}
 */
export function hasPendingState() {
  return pendingState !== null;
}

export function createInitialState({
  projectSlug,
  platform,
  capabilities,
  briefPath,
  businessContextPath,
  options = {}
}) {
  const now = new Date();
  const workflowId = `wf_${formatDate(now)}_${formatTime(now)}`;
  const baseState = {
    workflowId,
    projectSlug,
    platform,
    capabilities,
    status: 'initializing',
    currentPhase: 'init',
    completedAgents: [],
    pendingAgents: [],
    errors: [],
    contextFiles: {
      businessContext: businessContextPath || null,
      brief: briefPath || null
    },
    startTime: now.toISOString(),
    metadata: {
      triggerSource: 'cli',
      userName: options.userName || process.env.USER || process.env.USERNAME || null,
      notes: options.notes || null,
      options
    }
  };
  return baseState;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}

function formatTime(date) {
  const h = `${date.getHours()}`.padStart(2, '0');
  const m = `${date.getMinutes()}`.padStart(2, '0');
  const s = `${date.getSeconds()}`.padStart(2, '0');
  return `${h}${m}${s}`;
}

export function updatePhase(state, phase) {
  return { ...state, currentPhase: phase };
}

export function markStatus(state, status) {
  return { ...state, status };
}

export function appendCompletedAgent(state, entry) {
  const completedAgents = [...(state.completedAgents || []), entry];
  const pendingAgents = (state.pendingAgents || []).filter(name => name !== entry.name);
  return { ...state, completedAgents, pendingAgents };
}

export function setPendingAgents(state, pendingAgents) {
  return { ...state, pendingAgents };
}

export function setMetadata(state, metadata) {
  return { ...state, metadata: { ...(state.metadata || {}), ...metadata } };
}

export function pushError(state, error) {
  const errors = [...(state.errors || []), error];
  return { ...state, errors };
}

export function markComplete(state) {
  return {
    ...state,
    status: 'completed',
    currentPhase: 'complete',
    endTime: new Date().toISOString(),
    pendingAgents: []
  };
}
