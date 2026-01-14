#!/usr/bin/env node

/**
 * List Utility
 * Quick overview of all wireframe projects and workspaces
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
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

/**
 * Get default project from wireframe.config.json
 */
function getDefaultProject() {
  const configPath = path.join(rootDir, "wireframe.config.json");
  if (!fs.existsSync(configPath)) return null;

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return config.defaultProject || null;
  } catch {
    return null;
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
    })
    .map((workspace) => {
      const wireframesDir = path.join(projectsDir, workspace, "src/wireframes");
      let wireframes = [];

      if (fs.existsSync(wireframesDir)) {
        wireframes = fs
          .readdirSync(wireframesDir)
          .filter((file) => {
            const filePath = path.join(wireframesDir, file);
            const stat = fs.statSync(filePath);
            if (!stat.isDirectory() || file.startsWith(".")) return false;

            // Check if it has metadata.json
            const metadataPath = path.join(filePath, "metadata.json");
            return fs.existsSync(metadataPath);
          })
          .map((wireframe) => {
            const metadataPath = path.join(
              wireframesDir,
              wireframe,
              "metadata.json"
            );

            try {
              const metadata = JSON.parse(
                fs.readFileSync(metadataPath, "utf-8")
              );
              const variantCount = metadata.variants
                ? Object.keys(metadata.variants).length
                : 0;

              return {
                slug: wireframe,
                title: metadata.title || wireframe,
                variantCount,
                projectType: metadata.projectType || "multi-variant",
              };
            } catch {
              return {
                slug: wireframe,
                title: wireframe,
                variantCount: 0,
                projectType: "unknown",
                error: true,
              };
            }
          });
      }

      return {
        name: workspace,
        wireframes,
      };
    });
}

/**
 * Display the project list
 */
function displayList() {
  const defaultProject = getDefaultProject();
  const workspaces = getWorkspaces();

  console.log("");
  console.log(`${colors.cyan}${colors.bold}Wireframe Projects${colors.reset}`);
  console.log("─".repeat(60));
  console.log("");

  if (workspaces.length === 0) {
    console.log(`${colors.gray}No project workspaces found${colors.reset}`);
    console.log("");
    console.log(
      `${colors.yellow}Tip:${colors.reset} Run ${colors.cyan}npm run init${colors.reset} to create your first project`
    );
    console.log("");
    return;
  }

  let totalWireframes = 0;
  let totalVariants = 0;

  workspaces.forEach((workspace) => {
    const isDefault = workspace.name === defaultProject;
    const workspaceLabel = isDefault
      ? `${workspace.name} ${colors.green}(default)${colors.reset}`
      : workspace.name;

    console.log(
      `${colors.bold}${workspaceLabel}${colors.reset} ${colors.gray}[workspace]${colors.reset}`
    );

    if (workspace.wireframes.length === 0) {
      console.log(`  ${colors.gray}└─ No wireframes yet${colors.reset}`);
    } else {
      workspace.wireframes.forEach((wireframe, index) => {
        const isLast = index === workspace.wireframes.length - 1;
        const branch = isLast ? "└─" : "├─";

        const variantInfo =
          wireframe.variantCount > 0
            ? `${colors.blue}${wireframe.variantCount} variant${wireframe.variantCount === 1 ? "" : "s"}${colors.reset}`
            : `${colors.gray}no variants${colors.reset}`;

        const errorFlag = wireframe.error
          ? ` ${colors.yellow}[invalid metadata]${colors.reset}`
          : "";

        console.log(
          `  ${branch} ${wireframe.title} ${colors.gray}(${wireframe.slug})${colors.reset} - ${variantInfo}${errorFlag}`
        );

        totalWireframes++;
        totalVariants += wireframe.variantCount;
      });
    }

    console.log("");
  });

  // Summary
  console.log("─".repeat(60));
  console.log(
    `${colors.bold}Total:${colors.reset} ${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"}, ` +
      `${totalWireframes} wireframe${totalWireframes === 1 ? "" : "s"}, ` +
      `${totalVariants} variant${totalVariants === 1 ? "" : "s"}`
  );
  console.log("");

  if (!defaultProject) {
    console.log(
      `${colors.yellow}Note:${colors.reset} No default project set in wireframe.config.json`
    );
    console.log("");
  }
}

/**
 * Main execution
 */
async function main() {
  displayList();
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
  process.exit(1);
});
