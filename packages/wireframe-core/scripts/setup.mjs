#!/usr/bin/env node

/**
 * Setup Validation Script
 * Validates the wireframe framework environment and creates default config
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

let hasErrors = false;
let hasWarnings = false;

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  log.section("Checking Node.js version...");
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion >= 18) {
    log.success(`Node.js ${nodeVersion} (recommended: v18+)`);
  } else {
    log.error(
      `Node.js ${nodeVersion} is too old. Please upgrade to v18 or higher.`
    );
    hasErrors = true;
  }
}

/**
 * Check directory structure
 */
function checkDirectoryStructure() {
  log.section("Checking directory structure...");

  const requiredDirs = [
    "packages/wireframe-core",
    "projects",
  ];

  requiredDirs.forEach((dir) => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      log.success(dir);
    } else {
      log.error(`Missing directory: ${dir}`);
      hasErrors = true;
    }
  });
}

/**
 * Check for wireframe.config.json and create if missing
 */
function checkWireframeConfig() {
  log.section("Checking wireframe.config.json...");

  const configPath = path.join(rootDir, "wireframe.config.json");

  if (fs.existsSync(configPath)) {
    log.success("wireframe.config.json exists");

    // Validate config
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

      if (!config.defaultProject) {
        log.warn("wireframe.config.json missing 'defaultProject' field");
        hasWarnings = true;
      } else {
        log.info(`Default project: ${config.defaultProject}`);
      }
    } catch (error) {
      log.error(`wireframe.config.json is invalid JSON: ${error.message}`);
      hasErrors = true;
    }
  } else {
    log.warn("wireframe.config.json not found, creating default...");

    const defaultConfig = {
      defaultProject: null,
      selfIteration: {
        enabled: false,
        maxIterations: 2,
        autoFix: false,
        snapshotDelayMs: 750,
        devServerPort: 8080,
      },
    };

    try {
      fs.writeFileSync(
        configPath,
        JSON.stringify(defaultConfig, null, 2) + "\n"
      );
      log.success("Created wireframe.config.json with defaults");
      log.info(
        "Run 'npm run init' to create your first project and set defaultProject"
      );
    } catch (error) {
      log.error(`Failed to create wireframe.config.json: ${error.message}`);
      hasErrors = true;
    }
  }
}

/**
 * Check for package.json and node_modules
 */
function checkDependencies() {
  log.section("Checking dependencies...");

  const packageJsonPath = path.join(rootDir, "package.json");
  const nodeModulesPath = path.join(rootDir, "node_modules");

  if (!fs.existsSync(packageJsonPath)) {
    log.error("package.json not found");
    hasErrors = true;
    return;
  }

  log.success("package.json exists");

  if (!fs.existsSync(nodeModulesPath)) {
    log.warn("node_modules not found - dependencies not installed");
    log.info("Run 'npm install' to install dependencies");
    hasWarnings = true;
  } else {
    log.success("node_modules exists");
  }
}

/**
 * Check for existing projects
 */
function checkProjects() {
  log.section("Checking for wireframe projects...");

  const projectsDir = path.join(rootDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    log.error("projects/ directory not found");
    hasErrors = true;
    return;
  }

  const projects = fs
    .readdirSync(projectsDir)
    .filter((file) => {
      const stat = fs.statSync(path.join(projectsDir, file));
      return stat.isDirectory() && !file.startsWith(".");
    });

  if (projects.length === 0) {
    log.info("No wireframe projects found");
    log.info("Run 'npm run init' to create your first project");
  } else {
    log.success(`Found ${projects.length} project(s):`);
    projects.forEach((project) => {
      const wireframesDir = path.join(
        projectsDir,
        project,
        "src/wireframes"
      );

      if (fs.existsSync(wireframesDir)) {
        const wireframes = fs
          .readdirSync(wireframesDir)
          .filter((file) => {
            const stat = fs.statSync(path.join(wireframesDir, file));
            return stat.isDirectory() && !file.startsWith(".");
          });

        log.info(`  • ${project}: ${wireframes.length} wireframe(s)`);
      } else {
        log.info(`  • ${project}: no wireframes yet`);
      }
    });
  }
}

/**
 * Print summary and next steps
 */
function printSummary() {
  console.log("");
  console.log("═".repeat(60));

  if (hasErrors) {
    log.error("Setup validation failed with errors");
    log.info("Please fix the errors above before continuing");
    process.exit(1);
  } else if (hasWarnings) {
    log.warn("Setup validation completed with warnings");
    log.info("Review warnings above - they may not block usage");
  } else {
    log.success("Setup validation completed successfully!");
  }

  console.log("═".repeat(60));
  console.log("");

  // Next steps
  log.section("Next Steps:");

  const configPath = path.join(rootDir, "wireframe.config.json");
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : null;

  if (!config || !config.defaultProject) {
    console.log("  1. Create your first wireframe project:");
    console.log("     npm run init");
    console.log("");
    console.log("  2. Start the development server:");
    console.log("     npm run dev");
    console.log("");
    console.log("  3. Open your browser:");
    console.log("     http://localhost:8080");
  } else {
    console.log("  1. Start the development server:");
    console.log("     npm run dev");
    console.log("");
    console.log("  2. Create a new wireframe:");
    console.log("     npm run init");
    console.log("");
    console.log("  3. View documentation:");
    console.log("     See CLAUDE.md and AGENTS.md");
  }

  console.log("");
}

/**
 * Main execution
 */
async function main() {
  console.log("");
  console.log("═".repeat(60));
  console.log(`${colors.cyan}Wireframe Framework - Setup Validation${colors.reset}`);
  console.log("═".repeat(60));

  checkNodeVersion();
  checkDirectoryStructure();
  checkWireframeConfig();
  checkDependencies();
  checkProjects();
  printSummary();
}

main().catch((error) => {
  log.error(`Setup validation failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
