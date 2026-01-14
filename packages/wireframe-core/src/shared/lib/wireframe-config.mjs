import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILENAME = 'wireframe.config.json';
const repoRoot = path.resolve(__dirname, '..', '..', '..');

export const DEFAULT_WIREFRAME_CONFIG = Object.freeze({
  defaultProject: null,
  selfIteration: {
    enabled: false,
    maxIterations: 2,
    autoFix: false,
    gradeThreshold: 80,
    snapshotDelayMs: 750,
    historyDir: 'context/temp-agent-outputs/self-iteration',
    devServerPort: 8080
  }
});

let cachedConfig = null;
let cachedPath = null;
let cachedMtime = 0;

function cloneDefaultConfig() {
  return JSON.parse(JSON.stringify(DEFAULT_WIREFRAME_CONFIG));
}

function mergeConfig(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (Object.prototype.hasOwnProperty.call(source, 'defaultProject')) {
    const value = source.defaultProject;
    if (typeof value === 'string' || value === null) {
      target.defaultProject = value;
    }
  }
  if (source.selfIteration && typeof source.selfIteration === 'object') {
    target.selfIteration = {
      ...target.selfIteration,
      ...source.selfIteration
    };
  }
  return target;
}

function validateConfig(config, filePath) {
  const errors = [];

  if (config.defaultProject !== undefined && config.defaultProject !== null && typeof config.defaultProject !== 'string') {
    errors.push('defaultProject must be a string when provided');
  }

  if (config.selfIteration !== undefined) {
    if (typeof config.selfIteration !== 'object' || config.selfIteration === null) {
      errors.push('selfIteration must be an object');
    } else {
      const si = config.selfIteration;

      if (si.enabled !== undefined && typeof si.enabled !== 'boolean') {
        errors.push('selfIteration.enabled must be a boolean');
      }
      if (si.maxIterations !== undefined && (typeof si.maxIterations !== 'number' || si.maxIterations < 1 || si.maxIterations > 10)) {
        errors.push('selfIteration.maxIterations must be a number between 1 and 10');
      }
      if (si.autoFix !== undefined && typeof si.autoFix !== 'boolean') {
        errors.push('selfIteration.autoFix must be a boolean');
      }
      if (si.snapshotDelayMs !== undefined && (typeof si.snapshotDelayMs !== 'number' || si.snapshotDelayMs < 0)) {
        errors.push('selfIteration.snapshotDelayMs must be a non-negative number');
      }
      if (si.historyDir !== undefined && typeof si.historyDir !== 'string') {
        errors.push('selfIteration.historyDir must be a string');
      }
      if (si.devServerPort !== undefined && (typeof si.devServerPort !== 'number' || si.devServerPort < 1024 || si.devServerPort > 65535)) {
        errors.push('selfIteration.devServerPort must be a number between 1024 and 65535');
      }
      if (si.gradeThreshold !== undefined && (typeof si.gradeThreshold !== 'number' || si.gradeThreshold < 0 || si.gradeThreshold > 100)) {
        errors.push('selfIteration.gradeThreshold must be a number between 0 and 100');
      }
    }
  }

  if (errors.length > 0) {
    const relativePath = path.relative(repoRoot, filePath);
    throw new Error(
      `[wireframe-config] Invalid configuration in ${relativePath}:\n  - ${errors.join('\n  - ')}`
    );
  }
}

function parseJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    validateConfig(parsed, filePath);
    return parsed;
  } catch (error) {
    throw new Error(
      `[wireframe-config] Failed to read ${path.relative(repoRoot, filePath)}: ${error.message}`
    );
  }
}

function getStatsSafe(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return null;
  }
}

export function resolveConfigPath({ cwd } = {}) {
  const base = cwd ? path.resolve(cwd) : repoRoot;
  return path.resolve(base, CONFIG_FILENAME);
}

export function loadWireframeConfig({ cwd, fresh } = {}) {
  const configPath = resolveConfigPath({ cwd });
  const stats = getStatsSafe(configPath);

  if (!fresh && cachedConfig && cachedPath === configPath && stats && stats.mtimeMs === cachedMtime) {
    return JSON.parse(JSON.stringify(cachedConfig));
  }

  let config = cloneDefaultConfig();
  if (stats) {
    const parsed = parseJsonFile(configPath);
    config = mergeConfig(config, parsed);
  }

  cachedConfig = config;
  cachedPath = configPath;
  cachedMtime = stats ? stats.mtimeMs : 0;

  return JSON.parse(JSON.stringify(config));
}

function parseBoolean(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on', 'enabled'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off', 'disabled'].includes(normalized)) return false;
  return undefined;
}

function parseInteger(value) {
  if (value === undefined || value === null) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function sanitizeInteger(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = parseInteger(value);
  if (parsed === undefined) return fallback;
  const clamped = Math.max(min, Math.min(parsed, max));
  return clamped;
}

export function resolveSelfIterationOptions({
  overrides = {},
  env = process.env,
  cwd,
  fresh
} = {}) {
  const config = loadWireframeConfig({ cwd, fresh });
  const resolved = { ...config.selfIteration };

  const envEnabled = parseBoolean(env?.WIREFRAME_SELF_ITERATION);
  if (envEnabled !== undefined) resolved.enabled = envEnabled;

  const envAutoFix = parseBoolean(env?.WIREFRAME_SELF_ITERATION_AUTO_FIX);
  if (envAutoFix !== undefined) resolved.autoFix = envAutoFix;

  const envIterations = parseInteger(env?.WIREFRAME_SELF_ITERATION_MAX_ITERATIONS);
  if (envIterations !== undefined) resolved.maxIterations = envIterations;

  const envDelay = parseInteger(env?.WIREFRAME_SELF_ITERATION_SNAPSHOT_DELAY_MS);
  if (envDelay !== undefined) resolved.snapshotDelayMs = envDelay;

  const envHistory = env?.WIREFRAME_SELF_ITERATION_HISTORY_DIR;
  if (envHistory) {
    resolved.historyDir = envHistory;
  }

  const envPort = parseInteger(env?.WIREFRAME_SELF_ITERATION_DEV_SERVER_PORT);
  if (envPort !== undefined) resolved.devServerPort = envPort;

  const envGradeThreshold = parseInteger(env?.WIREFRAME_SELF_ITERATION_GRADE_THRESHOLD);
  if (envGradeThreshold !== undefined) resolved.gradeThreshold = envGradeThreshold;

  if (Object.prototype.hasOwnProperty.call(overrides, 'enabled')) {
    const overrideEnabled = parseBoolean(overrides.enabled);
    if (overrideEnabled !== undefined) {
      resolved.enabled = overrideEnabled;
    }
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'autoFix')) {
    const overrideAutoFix = parseBoolean(overrides.autoFix);
    if (overrideAutoFix !== undefined) {
      resolved.autoFix = overrideAutoFix;
    }
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'maxIterations')) {
    const overrideIterations = parseInteger(overrides.maxIterations);
    if (overrideIterations !== undefined) {
      resolved.maxIterations = overrideIterations;
    }
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'snapshotDelayMs')) {
    const overrideDelay = parseInteger(overrides.snapshotDelayMs);
    if (overrideDelay !== undefined) {
      resolved.snapshotDelayMs = overrideDelay;
    }
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'historyDir') && overrides.historyDir) {
    resolved.historyDir = overrides.historyDir;
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'devServerPort')) {
    const overridePort = parseInteger(overrides.devServerPort);
    if (overridePort !== undefined) {
      resolved.devServerPort = overridePort;
    }
  }

  if (Object.prototype.hasOwnProperty.call(overrides, 'gradeThreshold')) {
    const overrideThreshold = parseInteger(overrides.gradeThreshold);
    if (overrideThreshold !== undefined) {
      resolved.gradeThreshold = overrideThreshold;
    }
  }

  resolved.maxIterations = sanitizeInteger(resolved.maxIterations, DEFAULT_WIREFRAME_CONFIG.selfIteration.maxIterations, { min: 1, max: 10 });
  resolved.snapshotDelayMs = sanitizeInteger(resolved.snapshotDelayMs, DEFAULT_WIREFRAME_CONFIG.selfIteration.snapshotDelayMs, { min: 0, max: 10_000 });
  resolved.devServerPort = sanitizeInteger(resolved.devServerPort, DEFAULT_WIREFRAME_CONFIG.selfIteration.devServerPort, { min: 1024, max: 65535 });
  resolved.gradeThreshold = sanitizeInteger(resolved.gradeThreshold, DEFAULT_WIREFRAME_CONFIG.selfIteration.gradeThreshold, { min: 0, max: 100 });

  return resolved;
}

export function shouldSelfIterate({ overrides, env, cwd, fresh } = {}) {
  const options = resolveSelfIterationOptions({ overrides, env, cwd, fresh });
  return Boolean(options.enabled);
}
