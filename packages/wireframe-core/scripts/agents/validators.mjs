import path from "path";
import { fileSizeBytes, pathExists, readJson, readText } from "./fs-utils.mjs";
import { getAgentInfo } from "./definitions.mjs";
import { resolveProjectPath } from "../utils/path-helpers.mjs";

/**
 * Validate a single output file.
 * @param {object} output - Output definition from AGENT_METADATA
 * @param {string} projectSlug
 * @returns {Promise<{issues: string[], detail: object|null}>}
 */
async function validateSingleOutput(output, projectSlug) {
  const issues = [];
  const absPath = resolveProjectPath(import.meta.url, output.path, {
    project: projectSlug,
  });

  if (!pathExists(absPath)) {
    if (output.required) {
      issues.push(`missing:${output.path}`);
    }
    return { issues, detail: null };
  }

  const size = fileSizeBytes(absPath);
  const detail = { size };

  if (output.minBytes && size < output.minBytes) {
    issues.push(`too-small:${output.path}`);
  }

  if (output.type === 'json') {
    try {
      const data = await readJson(absPath);
      detail.parsed = true;
      if (output.requiredKeys) {
        for (const key of output.requiredKeys) {
          if (!hasNestedKey(data, key)) {
            issues.push(`missing-key:${output.path}:${key}`);
          }
        }
      }
    } catch (error) {
      issues.push(`invalid-json:${output.path}`);
      detail.error = error.message;
    }
  }

  if (output.type === 'markdown') {
    const content = await readText(absPath);
    if (!content.trim()) {
      issues.push(`empty:${output.path}`);
    }
  }

  return { issues, detail, path: output.path };
}

/**
 * Validate all outputs for an agent in parallel.
 * @param {string} agentName
 * @param {string} repoRoot
 * @param {string} projectSlug
 * @returns {Promise<{valid: boolean, issues: string[], details: object}>}
 */
export async function validateAgentOutputs(agentName, repoRoot, projectSlug) {
  const info = getAgentInfo(agentName);
  if (!info) {
    return { valid: false, issues: [`unknown-agent:${agentName}`] };
  }

  // Validate all outputs in parallel for better performance
  const results = await Promise.all(
    info.outputs.map(output => validateSingleOutput(output, projectSlug))
  );

  // Aggregate results
  const issues = results.flatMap(r => r.issues);
  const details = {};
  for (const result of results) {
    if (result.detail && result.path) {
      details[result.path] = result.detail;
    }
  }

  return { valid: issues.length === 0, issues, details };
}

function hasNestedKey(obj, keyPath) {
  if (!obj) return false;
  const segments = Array.isArray(keyPath) ? keyPath : keyPath.split('.');
  let current = obj;
  for (const segment of segments) {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      current = current[segment];
    } else {
      return false;
    }
  }
  return current !== undefined && current !== null;
}
