#!/usr/bin/env node

/**
 * Validate All
 * Orchestrates all validation checks across the wireframe framework
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { validateRouteUniqueness } from "./lib/route-validation.mjs";

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
};

let totalErrors = 0;

/**
 * Run a validation check
 */
function runValidation(name, command, options = {}) {
  log.section(name);

  try {
    const output = execSync(command, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: options.silent ? "pipe" : "inherit",
      ...options,
    });

    log.success(`${name} passed`);
    return { success: true, output };
  } catch (error) {
    log.error(`${name} failed`);
    totalErrors++;

    if (options.silent && error.stdout) {
      console.log(error.stdout);
    }
    if (options.silent && error.stderr) {
      console.error(error.stderr);
    }

    return { success: false, error };
  }
}

/**
 * Get all project workspaces
 */
function getWorkspaces() {
  const projectsDir = path.join(rootDir, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  return fs
    .readdirSync(projectsDir)
    .filter((file) => {
      const stat = fs.statSync(path.join(projectsDir, file));
      return stat.isDirectory() && !file.startsWith(".");
    });
}

/**
 * Validate metadata for all projects
 */
async function validateMetadata() {
  log.section("Metadata Validation");

  const workspaces = getWorkspaces();

  if (workspaces.length === 0) {
    log.info("No workspaces to validate");
    return;
  }

  for (const workspace of workspaces) {
    try {
      execSync(`npm run validate:metadata -w projects/${workspace}`, {
        cwd: rootDir,
        stdio: "inherit",
      });
      log.success(`${workspace}: Metadata valid`);
    } catch (error) {
      log.error(`${workspace}: Metadata validation failed`);
      totalErrors++;
    }
  }
}

/**
 * Validate route uniqueness
 */
function validateRoutes() {
  log.section("Route Validation");

  try {
    const result = validateRouteUniqueness();

    if (result.valid) {
      log.success("No route conflicts");
    } else {
      log.error(`Found ${result.conflicts.length} route conflict${result.conflicts.length === 1 ? "" : "s"}`);
      result.conflicts.forEach((conflict) => {
        console.log(`  ${colors.red}•${colors.reset} ${conflict}`);
      });
      totalErrors += result.conflicts.length;
    }
  } catch (error) {
    log.error(`Route validation failed: ${error.message}`);
    totalErrors++;
  }
}

/**
 * Validate business context (if exists)
 */
function validateBusinessContext() {
  log.section("Business Context Validation");

  const workspaces = getWorkspaces();
  let hasBusinessContext = false;

  for (const workspace of workspaces) {
    const contextPath = path.join(
      rootDir,
      "projects",
      workspace,
      "context/BUSINESS-CONTEXT.md"
    );

    if (fs.existsSync(contextPath)) {
      hasBusinessContext = true;

      try {
        // Check if business context JSON is in sync
        const jsonPath = path.join(
          rootDir,
          "projects",
          workspace,
          "context/temp-agent-outputs/business-context.json"
        );

        if (fs.existsSync(jsonPath)) {
          log.success(`${workspace}: Business context JSON exists`);
        } else {
          log.error(`${workspace}: Run 'npm run export:business-context' to sync`);
          totalErrors++;
        }
      } catch (error) {
        log.error(`${workspace}: Business context validation failed`);
        totalErrors++;
      }
    }
  }

  if (!hasBusinessContext) {
    log.info("No business context files found");
  }
}

/**
 * Validate TypeScript (optional)
 */
function validateTypeScript() {
  log.section("TypeScript Type Check");

  const tsconfigPath = path.join(rootDir, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    log.info("No root tsconfig.json found (skipping type check)");
    return;
  }

  try {
    execSync("npx tsc --noEmit", {
      cwd: rootDir,
      stdio: "pipe",
    });
    log.success("TypeScript type check passed");
  } catch (error) {
    log.error("TypeScript type check failed (run 'npx tsc --noEmit' for details)");
    totalErrors++;
  }
}

/**
 * Display summary
 */
function displaySummary() {
  console.log("");
  console.log("═".repeat(60));

  if (totalErrors === 0) {
    console.log(`${colors.green}${colors.bold}✓ All validations passed!${colors.reset}`);
  } else {
    console.log(
      `${colors.red}${colors.bold}✗ ${totalErrors} validation error${totalErrors === 1 ? "" : "s"} found${colors.reset}`
    );
  }

  console.log("═".repeat(60));
  console.log("");

  if (totalErrors > 0) {
    console.log(`${colors.cyan}Fix errors above and run 'npm run validate:all' again${colors.reset}`);
    console.log("");
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

/**
 * Main execution
 */
async function main() {
  console.log("");
  console.log("═".repeat(60));
  console.log(`${colors.cyan}${colors.bold}Wireframe Framework - Validate All${colors.reset}`);
  console.log("═".repeat(60));

  await validateMetadata();
  validateRoutes();
  validateBusinessContext();
  validateTypeScript();
  displaySummary();
}

main().catch((error) => {
  console.error("");
  console.error(`${colors.red}Validation failed:${colors.reset} ${error.message}`);
  console.error(error);
  process.exit(1);
});
