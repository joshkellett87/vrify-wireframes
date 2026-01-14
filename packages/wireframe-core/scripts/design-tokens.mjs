#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { resolveProjectPath, resolveWorkspaceRoot } from "./utils/path-helpers.mjs";

const WORKSPACE_ROOT = resolveWorkspaceRoot(import.meta.url);
const BASE_PATH = resolve(WORKSPACE_ROOT, "context/design-system.json");

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { project: null };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--project" && args[i + 1]) {
      result.project = args[i + 1];
      i += 1;
    } else if (arg.startsWith("--project=")) {
      result.project = arg.split("=")[1];
    }
  }

  return result;
}

function assertSafeProjectSlug(slug) {
  if (!slug) return;
  const INVALID_PATTERN = /[\\/]|\.\./;
  if (INVALID_PATTERN.test(slug)) {
    throw new Error(`Invalid project slug '${slug}'. Provide a slug like 'platform-pricing'.`);
  }
}

async function loadJson(path) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function isPlainObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

/**
 * Recursively merge plain-object trees. Undefined overrides are ignored so defaults persist.
 * Explicit nulls replace base values; document overrides accordingly when using null.
 */
function deepMerge(base, override) {
  // Recursively merge plain-object trees; arrays and primitives are replaced.
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(override ?? {})) {
    if (value === undefined) continue;
    if (isPlainObject(out[key]) && isPlainObject(value)) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function mergeTokens(base, override) {
  // Deep merge to support nested token groups (e.g., color.background.surface).
  // If you prefer shallow merging (2-level), replace this with a one-level spread.
  return deepMerge(base, override);
}

function printTokens(base, merged, override) {
  const projectLabel = override ? " (with project overrides)" : "";
  console.log(`Design tokens${projectLabel}`);
  console.log("----------------------------------------");

  for (const [group, values] of Object.entries(merged)) {
    if (typeof values !== "object" || values === null) {
      const baseValue = base[group];
      const overrideValue = override?.[group];
      const marker = overrideValue && overrideValue !== baseValue ? "*" : " ";
      console.log(`${marker} ${group}: ${values}`);
      continue;
    }

    console.log(`\n[${group}]`);
    for (const [token, value] of Object.entries(values)) {
      const baseValue = base[group]?.[token];
      const overrideValue = override?.[group]?.[token];
      const marker = overrideValue && overrideValue !== baseValue ? "*" : " ";
      console.log(`${marker} ${token}: ${value}`);
    }
  }

  if (override) {
    console.log("\n* indicates project override");
  }
}

async function main() {
  const args = parseArgs();
  const base = await loadJson(BASE_PATH);

  if (!base) {
    console.error("Design system base file not found at context/design-system.json");
    process.exitCode = 1;
    return;
  }

  let override = null;
  if (args.project) {
    assertSafeProjectSlug(args.project);
    try {
      const overridePath = resolveProjectPath(
        import.meta.url,
        `src/wireframes/${args.project}/design-overrides.json`,
        { project: args.project }
      );
      override = await loadJson(overridePath);
      if (!override) {
        console.warn(
          `No overrides found for project '${args.project}'. (Looked for ${overridePath})`
        );
      }
    } catch (error) {
      console.warn(
        `[design-tokens] Unable to resolve design overrides for '${args.project}': ${error.message}`
      );
    }
  }

  const merged = mergeTokens(base, override ?? undefined);
  printTokens(base, merged, override ?? undefined);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
