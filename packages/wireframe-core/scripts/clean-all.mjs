#!/usr/bin/env node

/**
 * Clean All
 * Nuclear option - resets workspace to fresh state with confirmation
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { execSync } from "child_process";

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
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bold}${msg}${colors.reset}`),
};

/**
 * Create readline interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question
 */
function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Recursively delete directory
 */
function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return false;

  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  } catch (error) {
    log.error(`Failed to delete ${dirPath}: ${error.message}`);
    return false;
  }
}

/**
 * Delete file
 */
function deleteFile(filePath) {
  if (!fs.existsSync(filePath)) return false;

  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    log.error(`Failed to delete ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Get directory size in MB
 */
function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;

  try {
    const output = execSync(`du -sm "${dirPath}"`, {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const size = parseInt(output.split("\t")[0]);
    return size;
  } catch {
    return 0;
  }
}

/**
 * Clean temp files
 */
function cleanTempFiles() {
  log.section("Cleaning Temporary Files");

  const cleaned = [];

  // Clean context/temp directories in all projects
  const projectsDir = path.join(rootDir, "projects");
  if (fs.existsSync(projectsDir)) {
    const workspaces = fs
      .readdirSync(projectsDir)
      .filter((file) => {
        const stat = fs.statSync(path.join(projectsDir, file));
        return stat.isDirectory() && !file.startsWith(".");
      });

    workspaces.forEach((workspace) => {
      const tempDir = path.join(projectsDir, workspace, "context/temp");
      const size = getDirectorySize(tempDir);

      if (deleteDirectory(tempDir)) {
        log.success(`${workspace}/context/temp/ (${size}MB freed)`);
        cleaned.push(tempDir);

        // Recreate the directory
        fs.mkdirSync(tempDir, { recursive: true });
      }
    });
  }

  return cleaned;
}

/**
 * Clean agent outputs
 */
function cleanAgentOutputs() {
  log.section("Cleaning Agent Outputs");

  const cleaned = [];

  const projectsDir = path.join(rootDir, "projects");
  if (fs.existsSync(projectsDir)) {
    const workspaces = fs
      .readdirSync(projectsDir)
      .filter((file) => {
        const stat = fs.statSync(path.join(projectsDir, file));
        return stat.isDirectory() && !file.startsWith(".");
      });

    workspaces.forEach((workspace) => {
      const agentDir = path.join(
        projectsDir,
        workspace,
        "context/temp-agent-outputs"
      );
      const size = getDirectorySize(agentDir);

      if (deleteDirectory(agentDir)) {
        log.success(`${workspace}/context/temp-agent-outputs/ (${size}MB freed)`);
        cleaned.push(agentDir);
      }
    });
  }

  return cleaned;
}

/**
 * Clean build artifacts
 */
function cleanBuildArtifacts() {
  log.section("Cleaning Build Artifacts");

  const cleaned = [];

  const projectsDir = path.join(rootDir, "projects");
  if (fs.existsSync(projectsDir)) {
    const workspaces = fs
      .readdirSync(projectsDir)
      .filter((file) => {
        const stat = fs.statSync(path.join(projectsDir, file));
        return stat.isDirectory() && !file.startsWith(".");
      });

    workspaces.forEach((workspace) => {
      // Clean dist/
      const distDir = path.join(projectsDir, workspace, "dist");
      const distSize = getDirectorySize(distDir);
      if (deleteDirectory(distDir)) {
        log.success(`${workspace}/dist/ (${distSize}MB freed)`);
        cleaned.push(distDir);
      }

      // Clean .vite cache
      const viteDir = path.join(
        projectsDir,
        workspace,
        "node_modules/.vite"
      );
      const viteSize = getDirectorySize(viteDir);
      if (deleteDirectory(viteDir)) {
        log.success(`${workspace}/node_modules/.vite/ (${viteSize}MB freed)`);
        cleaned.push(viteDir);
      }
    });
  }

  return cleaned;
}

/**
 * Clean MCP caches
 */
function cleanMCPCaches() {
  log.section("Cleaning MCP Caches");

  const cleaned = [];

  // Chrome DevTools MCP cache
  const chromeCachePath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".cache/chrome-devtools-mcp"
  );
  const chromeSize = getDirectorySize(chromeCachePath);

  if (deleteDirectory(chromeCachePath)) {
    log.success(`Chrome DevTools MCP cache (${chromeSize}MB freed)`);
    cleaned.push(chromeCachePath);
  }

  // MCP logs
  const mcpLogsPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    "Library/Caches/claude-cli-nodejs"
  );

  if (fs.existsSync(mcpLogsPath)) {
    const mcpLogsSize = getDirectorySize(mcpLogsPath);
    // Only clean mcp-logs-chrome-devtools subdirectory
    const chromeLogsPath = path.join(mcpLogsPath, "*/mcp-logs-chrome-devtools");

    try {
      execSync(`rm -rf ${chromeLogsPath}`, { stdio: "pipe" });
      log.success(`MCP Chrome logs (${mcpLogsSize}MB freed)`);
      cleaned.push(chromeLogsPath);
    } catch {
      // Ignore if path doesn't exist
    }
  }

  return cleaned;
}

/**
 * Main execution
 */
async function main() {
  const rl = createInterface();

  console.log("");
  console.log("═".repeat(60));
  console.log(`${colors.red}${colors.bold}⚠️  WARNING: Nuclear Cleanup${colors.reset}`);
  console.log("═".repeat(60));
  console.log("");
  log.warn("This will delete:");
  console.log("  • All temporary files (context/temp/)");
  console.log("  • All agent outputs (context/temp-agent-outputs/)");
  console.log("  • All build artifacts (dist/, .vite/)");
  console.log("  • MCP caches and logs");
  console.log("");
  log.info("This will NOT delete:");
  console.log("  • Your wireframe projects");
  console.log("  • Source code");
  console.log("  • node_modules");
  console.log("  • Git history");
  console.log("");

  const answer = await ask(
    rl,
    `${colors.yellow}Are you sure you want to continue? (yes/no):${colors.reset} `
  );

  if (answer !== "yes") {
    rl.close();
    console.log("");
    log.info("Cleanup cancelled");
    console.log("");
    return;
  }

  rl.close();

  console.log("");
  log.section("Starting Cleanup");

  const totalCleaned = [
    ...cleanTempFiles(),
    ...cleanAgentOutputs(),
    ...cleanBuildArtifacts(),
    ...cleanMCPCaches(),
  ];

  console.log("");
  console.log("═".repeat(60));
  log.success(`Cleanup complete! Removed ${totalCleaned.length} locations`);
  console.log("═".repeat(60));
  console.log("");
}

main().catch((error) => {
  console.error("");
  log.error(`Cleanup failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
