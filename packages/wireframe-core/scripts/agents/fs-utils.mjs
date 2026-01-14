import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function resolvePath(repoRoot, relativePath) {
  return path.resolve(repoRoot, relativePath);
}

export async function readJson(filePath) {
  const raw = await fsp.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function writeJson(filePath, data) {
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function pathExists(filePath) {
  return fs.existsSync(filePath);
}

export function fileSizeBytes(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const stats = fs.statSync(filePath);
  return stats.isFile() ? stats.size : 0;
}

export async function readText(filePath) {
  return await fsp.readFile(filePath, 'utf8');
}

export async function writeText(filePath, contents) {
  await fsp.writeFile(filePath, contents, 'utf8');
}

export function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
