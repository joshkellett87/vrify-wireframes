import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDir } from './fs-utils.mjs';
import { resolveFrameworkRoot, resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

/**
 * Get repo root from any script location
 */
export function getRepoRoot(importMetaUrl) {
  return resolveWorkspaceRoot(importMetaUrl);
}

export function getFrameworkRoot(importMetaUrl) {
  return resolveFrameworkRoot(importMetaUrl);
}

/**
 * Convert string to kebab-case slug
 */
export function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Convert slug to PascalCase
 */
export function pascalCase(slug) {
  return slug
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Bump semantic version (patch increment)
 */
export function bumpVersion(version) {
  if (!version) return '1.0.0';
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return '1.0.0';
  const [, major, minor, patch] = match;
  return `${major}.${minor}.${parseInt(patch, 10) + 1}`;
}

/**
 * Copy directory recursively
 */
export function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }

  ensureDir(dest);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Parse command-line arguments into key-value object
 * Supports both --key=value and --key value formats
 */
export function parseCliArgs(argv) {
  const args = {};
  let i = 0;

  while (i < argv.length) {
    const arg = argv[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);

      // Check for --key=value format
      if (key.includes('=')) {
        const [name, value] = key.split('=', 2);
        args[name] = value;
        i++;
      }
      // Check for --key value format
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        args[key] = argv[i + 1];
        i += 2;
      }
      // Boolean flag (--key with no value)
      else {
        args[key] = true;
        i++;
      }
    } else {
      i++;
    }
  }

  return args;
}

/**
 * Validate required CLI arguments
 */
export function validateRequiredArgs(args, required) {
  const missing = required.filter(key => !args[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required arguments: ${missing.join(', ')}`);
  }
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}
