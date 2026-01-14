import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const FRAMEWORK_PKG_NAME = "@wireframe/core";
const PROJECTS_DIR_NAME = "projects";

function readPackageJson(dir) {
  try {
    const pkg = fs.readFileSync(path.join(dir, "package.json"), "utf-8");
    return JSON.parse(pkg);
  } catch {
    return null;
  }
}

function findUp(startDir, predicate) {
  let current = startDir;
  while (true) {
    if (predicate(current)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function readConfigDefaultProject(workspaceRoot) {
  const configPath = path.join(workspaceRoot, "wireframe.config.json");
  if (!fs.existsSync(configPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    if (config && typeof config.defaultProject === "string" && config.defaultProject.trim()) {
      return config.defaultProject.trim();
    }
    const historyDir = config?.selfIteration?.historyDir;
    if (typeof historyDir === "string") {
      const match = historyDir.match(/projects\/([^/]+)/i);
      if (match) {
        return match[1];
      }
    }
  } catch {
    // ignore malformed config
  }
  return null;
}

function listWorkspaceProjects(workspaceRoot) {
  const projectsDir = path.join(workspaceRoot, PROJECTS_DIR_NAME);
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  return fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function normalizeRelativePath(relativePath) {
  const normalized = path.normalize(relativePath).replace(/^[./\\]+/, "");
  if (normalized.startsWith("..")) {
    throw new Error(`Refusing to resolve project path outside workspace: ${relativePath}`);
  }
  return normalized;
}

export function resolveFrameworkRoot(moduleUrl) {
  const fromDir = path.dirname(fileURLToPath(moduleUrl));
  const found = findUp(fromDir, (dir) => {
    const pkg = readPackageJson(dir);
    return pkg?.name === FRAMEWORK_PKG_NAME;
  });
  return found ?? fromDir;
}

export function resolveWorkspaceRoot(moduleUrl) {
  const frameworkRoot = resolveFrameworkRoot(moduleUrl);
  const found = findUp(path.dirname(frameworkRoot), (dir) => {
    const pkg = readPackageJson(dir);
    return Array.isArray(pkg?.workspaces);
  });
  return found ?? frameworkRoot;
}

export function resolveProjectSlug(moduleUrl, options = {}) {
  const workspaceRoot = resolveWorkspaceRoot(moduleUrl);
  const { project } = options;

  const available = listWorkspaceProjects(workspaceRoot);
  const envActive = process.env.WIREFRAME_ACTIVE_PROJECT;
  const envDefault = process.env.WIREFRAME_DEFAULT_PROJECT;
  const configDefault = readConfigDefaultProject(workspaceRoot);

  const requested = project ?? envActive ?? configDefault ?? envDefault;
  if (requested) {
    if (available.length === 0) {
      throw new Error(
        `No projects directory detected in workspace root ${workspaceRoot}. Expected at least ${PROJECTS_DIR_NAME}/<slug>.`,
      );
    }

    if (!available.includes(requested)) {
      throw new Error(
        `Project "${requested}" not found. Available projects: ${available.join(", ") || "(none)"}`,
      );
    }
    return requested;
  }

  if (available.length === 0) {
    // Legacy single-repo layout where project lived at workspace root.
    return null;
  }

  if (configDefault && available.includes(configDefault)) {
    return configDefault;
  }

  if (envDefault && available.includes(envDefault)) {
    return envDefault;
  }

  if (available.length === 1) {
    return available[0];
  }

  throw new Error(
    `Multiple projects detected (${available.join(
      ", ",
    )}). Specify one with --project <slug> or WIREFRAME_ACTIVE_PROJECT.`,
  );
}

export function resolveProjectPath(moduleUrl, relativePath, options = {}) {
  const workspaceRoot = resolveWorkspaceRoot(moduleUrl);
  const normalized = normalizeRelativePath(relativePath);

  const legacyCandidate = path.join(workspaceRoot, normalized);
  if (fs.existsSync(legacyCandidate)) {
    return legacyCandidate;
  }

  const slug = resolveProjectSlug(moduleUrl, options);
  if (!slug) {
    return legacyCandidate;
  }

  return path.join(workspaceRoot, PROJECTS_DIR_NAME, slug, normalized);
}

export function resolveProjectRoot(moduleUrl, options = {}) {
  const workspaceRoot = resolveWorkspaceRoot(moduleUrl);
  const slug = resolveProjectSlug(moduleUrl, options);

  if (!slug) {
    return workspaceRoot;
  }

  return path.join(workspaceRoot, PROJECTS_DIR_NAME, slug);
}
