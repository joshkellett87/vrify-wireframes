import fs from "fs";
import path from "path";
import { getFullRoutes } from "../../dist/shared/lib/metadata-schema.mjs";
import { resolveWorkspaceRoot } from "../utils/path-helpers.mjs";

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read metadata at ${filePath}: ${error.message}`);
    return null;
  }
}

function collectWireframeMetadata(wireframesDir) {
  const metadataList = [];

  if (!fs.existsSync(wireframesDir)) {
    return metadataList;
  }

  const entries = fs.readdirSync(wireframesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const metadataPath = path.join(wireframesDir, entry.name, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
      continue;
    }

    const metadata = readJsonFile(metadataPath);

    if (metadata && typeof metadata.slug === "string" && metadata.slug.trim().length > 0) {
      metadataList.push({
        slug: metadata.slug.trim(),
        metadata,
        source: metadataPath,
      });
    }
  }

  return metadataList;
}

function discoverAllProjectMetadata(moduleUrl) {
  const workspaceRoot = resolveWorkspaceRoot(moduleUrl);
  const collected = [];

  // Legacy layout support: src/wireframes/*/metadata.json
  const rootWireframes = path.join(workspaceRoot, "src", "wireframes");
  collected.push(...collectWireframeMetadata(rootWireframes));

  const projectsRoot = path.join(workspaceRoot, "projects");
  if (fs.existsSync(projectsRoot)) {
    const workspaces = fs.readdirSync(projectsRoot, { withFileTypes: true });

    for (const workspace of workspaces) {
      if (!workspace.isDirectory()) {
        continue;
      }

      const workspaceWireframes = path.join(
        projectsRoot,
        workspace.name,
        "src",
        "wireframes"
      );
      collected.push(...collectWireframeMetadata(workspaceWireframes));
    }
  }

  return collected;
}

export function validateRouteUniqueness() {
  try {
    const projects = discoverAllProjectMetadata(import.meta.url);
    const conflicts = [];
    const routeOwners = new Map();

    for (const project of projects) {
      const fullRoutes = getFullRoutes(project.metadata);
      const routes = [
        fullRoutes.index,
        ...fullRoutes.variants,
        ...fullRoutes.resources,
      ].filter(Boolean);

      for (const route of routes) {
        if (!routeOwners.has(route)) {
          routeOwners.set(route, project.slug);
          continue;
        }

        const existingOwner = routeOwners.get(route);
        if (existingOwner !== project.slug) {
          conflicts.push(
            `Route "${route}" is claimed by both "${existingOwner}" and "${project.slug}"`
          );
        }
      }
    }

    return {
      valid: conflicts.length === 0,
      conflicts,
    };
  } catch (error) {
    console.error("Error validating route uniqueness:", error);
    return {
      valid: false,
      conflicts: ["Validation failed due to error"],
    };
  }
}
