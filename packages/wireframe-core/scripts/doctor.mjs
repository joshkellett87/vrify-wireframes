#!/usr/bin/env node

/**
 * Doctor Diagnostic
 * Comprehensive health check for the wireframe framework
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
  success: (msg) => console.log(`  ${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`  ${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`  ${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bold}${msg}${colors.reset}`),
};

let warnings = 0;
let errors = 0;

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  log.section("Node.js Environment");

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion >= 20) {
    log.success(`Node.js ${nodeVersion} (recommended: v20+)`);
  } else if (majorVersion >= 18) {
    log.warn(`Node.js ${nodeVersion} (recommended: v20+, minimum: v18)`);
    warnings++;
  } else {
    log.error(`Node.js ${nodeVersion} is too old (minimum: v18)`);
    errors++;
  }

  // Check npm version
  try {
    const npmVersion = execSync("npm --version", { encoding: "utf-8" }).trim();
    log.success(`npm ${npmVersion}`);
  } catch {
    log.warn("npm version could not be determined");
    warnings++;
  }
}

/**
 * Check dependencies
 */
function checkDependencies() {
  log.section("Dependencies");

  const nodeModulesPath = path.join(rootDir, "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    log.error("node_modules not found - run 'npm install'");
    errors++;
    return;
  }

  log.success("node_modules exists");

  // Check critical packages
  const criticalPackages = ["react", "react-dom", "vite", "tailwindcss"];

  criticalPackages.forEach((pkg) => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      log.success(`${pkg} installed`);
    } else {
      log.error(`${pkg} not found`);
      errors++;
    }
  });

  // Check for outdated packages
  try {
    execSync("npm outdated --json", { encoding: "utf-8", stdio: "pipe" });
    log.success("All packages up to date");
  } catch (error) {
    const output = error.stdout || "";
    if (output) {
      try {
        const outdated = JSON.parse(output);
        const count = Object.keys(outdated).length;
        if (count > 0) {
          log.warn(`${count} package${count === 1 ? "" : "s"} outdated (run 'npm outdated' for details)`);
          warnings++;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }
}

/**
 * Check project structure
 */
function checkProjectStructure() {
  log.section("Project Structure");

  const requiredDirs = [
    "packages/wireframe-core",
    "projects",
    "packages/wireframe-core/scripts",
    "packages/wireframe-core/templates",
  ];

  requiredDirs.forEach((dir) => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      log.success(dir);
    } else {
      log.error(`Missing: ${dir}`);
      errors++;
    }
  });

  // Check templates
  const templateTypes = ["blank", "showcase", "example"];
  templateTypes.forEach((template) => {
    const templatePath = path.join(
      rootDir,
      `packages/wireframe-core/templates/projects/${template}`
    );
    if (fs.existsSync(templatePath)) {
      log.success(`Template: ${template}`);
    } else {
      log.warn(`Template missing: ${template}`);
      warnings++;
    }
  });
}

/**
 * Check wireframe projects
 */
function checkWireframeProjects() {
  log.section("Wireframe Projects");

  const projectsDir = path.join(rootDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    log.error("projects/ directory not found");
    errors++;
    return;
  }

  const workspaces = fs
    .readdirSync(projectsDir)
    .filter((file) => {
      const stat = fs.statSync(path.join(projectsDir, file));
      return stat.isDirectory() && !file.startsWith(".");
    });

  if (workspaces.length === 0) {
    log.info("No project workspaces found (run 'npm run init')");
    return;
  }

  log.success(`Found ${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"}`);

  workspaces.forEach((workspace) => {
    const wireframesDir = path.join(projectsDir, workspace, "src/wireframes");

    if (!fs.existsSync(wireframesDir)) {
      log.warn(`${workspace}: No wireframes directory`);
      warnings++;
      return;
    }

    const wireframes = fs
      .readdirSync(wireframesDir)
      .filter((file) => {
        const filePath = path.join(wireframesDir, file);
        const stat = fs.statSync(filePath);
        return stat.isDirectory() && !file.startsWith(".");
      });

    if (wireframes.length === 0) {
      log.info(`${workspace}: No wireframes yet`);
      return;
    }

    wireframes.forEach((wireframe) => {
      const metadataPath = path.join(wireframesDir, wireframe, "metadata.json");

      if (!fs.existsSync(metadataPath)) {
        log.error(`${workspace}/${wireframe}: Missing metadata.json`);
        errors++;
        return;
      }

      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

        // Check schema version
        if (!metadata.schemaVersion || metadata.schemaVersion !== "2.0") {
          log.warn(`${workspace}/${wireframe}: Schema version not 2.0`);
          warnings++;
        }

        // Check required fields
        const requiredFields = ["id", "slug", "title", "description", "routes"];
        const missing = requiredFields.filter((field) => !metadata[field]);

        if (missing.length > 0) {
          log.error(
            `${workspace}/${wireframe}: Missing fields: ${missing.join(", ")}`
          );
          errors++;
        } else {
          const variantCount = metadata.variants
            ? Object.keys(metadata.variants).length
            : 0;
          log.success(
            `${workspace}/${wireframe}: Valid (${variantCount} variant${variantCount === 1 ? "" : "s"})`
          );
        }
      } catch (error) {
        log.error(`${workspace}/${wireframe}: Invalid metadata.json - ${error.message}`);
        errors++;
      }
    });
  });
}

/**
 * Check for route conflicts
 */
function checkRouteConflicts() {
  log.section("Route Validation");

  try {
    const result = validateRouteUniqueness();

    if (result.valid) {
      log.success("No route conflicts detected");
    } else {
      log.error(`Found ${result.conflicts.length} route conflict${result.conflicts.length === 1 ? "" : "s"}:`);
      result.conflicts.forEach((conflict) => {
        log.error(`  - ${conflict}`);
      });
      errors += result.conflicts.length;
    }
  } catch (error) {
    log.warn(`Could not validate routes - ${error.message}`);
    warnings++;
  }
}

/**
 * Check git status
 */
function checkGitStatus() {
  log.section("Git Repository");

  try {
    execSync("git rev-parse --git-dir", { stdio: "pipe" });
    log.success("Git repository initialized");

    // Check for uncommitted changes
    try {
      const status = execSync("git status --porcelain", {
        encoding: "utf-8",
      }).trim();

      if (status) {
        const lines = status.split("\n").length;
        log.warn(`${lines} uncommitted file${lines === 1 ? "" : "s"}`);
        warnings++;
      } else {
        log.success("Working tree clean");
      }
    } catch {
      log.warn("Could not check git status");
      warnings++;
    }

    // Check current branch
    try {
      const branch = execSync("git branch --show-current", {
        encoding: "utf-8",
      }).trim();
      log.info(`Current branch: ${branch}`);
    } catch {
      // Ignore
    }
  } catch {
    log.info("Not a git repository");
  }
}

/**
 * Check configuration files
 */
function checkConfigFiles() {
  log.section("Configuration Files");

  const configFiles = [
    { path: "wireframe.config.json", required: false },
    { path: "package.json", required: true },
    { path: ".gitignore", required: false },
    { path: "tsconfig.json", required: false },
  ];

  configFiles.forEach((config) => {
    const filePath = path.join(rootDir, config.path);

    if (fs.existsSync(filePath)) {
      // Validate JSON files
      if (config.path.endsWith(".json")) {
        try {
          JSON.parse(fs.readFileSync(filePath, "utf-8"));
          log.success(`${config.path} (valid)`);
        } catch {
          log.error(`${config.path} (invalid JSON)`);
          errors++;
        }
      } else {
        log.success(config.path);
      }
    } else if (config.required) {
      log.error(`${config.path} not found`);
      errors++;
    } else {
      log.info(`${config.path} not found (optional)`);
    }
  });

  // Check default project setting
  const wireframeConfigPath = path.join(rootDir, "wireframe.config.json");
  if (fs.existsSync(wireframeConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(wireframeConfigPath, "utf-8"));
      if (config.defaultProject) {
        log.info(`Default project: ${config.defaultProject}`);
      } else {
        log.warn("No default project set in wireframe.config.json");
        warnings++;
      }
    } catch {
      // Already caught above
    }
  }
}

/**
 * Display summary
 */
function displaySummary() {
  console.log("");
  console.log("═".repeat(60));

  if (errors === 0 && warnings === 0) {
    console.log(`${colors.green}${colors.bold}✓ All checks passed!${colors.reset}`);
  } else if (errors === 0) {
    console.log(
      `${colors.yellow}${colors.bold}⚠ ${warnings} warning${warnings === 1 ? "" : "s"} found${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}${colors.bold}✗ ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"} found${colors.reset}`
    );
  }

  console.log("═".repeat(60));
  console.log("");

  if (errors > 0 || warnings > 0) {
    console.log(`${colors.cyan}Next Steps:${colors.reset}`);
    if (errors > 0) {
      console.log(`  1. Fix errors listed above`);
      console.log(`  2. Run 'npm run doctor' again to verify`);
    } else {
      console.log(`  1. Review warnings above`);
      console.log(`  2. Warnings won't block usage but should be addressed`);
    }
    console.log("");
  }

  process.exit(errors > 0 ? 1 : 0);
}

/**
 * Main execution
 */
async function main() {
  console.log("");
  console.log("═".repeat(60));
  console.log(`${colors.cyan}${colors.bold}Wireframe Framework Doctor${colors.reset}`);
  console.log(`${colors.cyan}Running comprehensive health check...${colors.reset}`);
  console.log("═".repeat(60));

  checkNodeVersion();
  checkDependencies();
  checkProjectStructure();
  checkWireframeProjects();
  checkRouteConflicts();
  checkGitStatus();
  checkConfigFiles();
  displaySummary();
}

main().catch((error) => {
  console.error("");
  console.error(`${colors.red}Doctor failed:${colors.reset} ${error.message}`);
  console.error(error);
  process.exit(1);
});
