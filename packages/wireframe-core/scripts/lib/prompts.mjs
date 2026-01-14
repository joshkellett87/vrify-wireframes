#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';

const FRONT_MATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

/**
 * Read a prompt file with YAML front matter and return its parsed representation.
 */
export async function loadPrompt(filePath) {
  const absolutePath = resolve(filePath);
  const raw = await readFile(absolutePath, 'utf8');
  const { frontMatter, body } = parsePrompt(raw, absolutePath);
  return {
    path: absolutePath,
    frontMatter,
    body,
    raw,
  };
}

/**
 * Parse the raw prompt contents. Throws if front matter is missing or malformed.
 */
export function parsePrompt(raw, context = 'prompt') {
  const match = raw.match(FRONT_MATTER_PATTERN);
  if (!match) {
    throw new Error(`Prompt ${context} is missing valid front matter (--- block).`);
  }

  const [, frontMatterSource, body] = match;
  let frontMatter;
  try {
    frontMatter = YAML.parse(frontMatterSource) ?? {};
  } catch (error) {
    throw new Error(`Failed parsing front matter for ${context}: ${error.message}`);
  }

  if (typeof frontMatter !== 'object' || Array.isArray(frontMatter)) {
    throw new Error(`Front matter for ${context} must resolve to an object.`);
  }

  return { frontMatter, body };
}

export function assertFields(frontMatter, requiredFields, context) {
  const missing = requiredFields.filter((field) => !(field in frontMatter));
  if (missing.length > 0) {
    throw new Error(
      `Prompt ${context} is missing required front matter field(s): ${missing.join(', ')}.`,
    );
  }
}

export function coerceArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}
