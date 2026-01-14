#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../../", import.meta.url)));

function runNode(args) {
  return spawnSync("node", args, {
    cwd: ROOT,
    encoding: "utf8",
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

(function main() {
  const ok = runNode(["scripts/design-tokens.mjs", "--project", "platform-pricing"]);
  assert(ok.status === 0, `Expected success exit code, got ${ok.status}\n${ok.stderr}`);
  assert(
    ok.stdout.includes("* button: 12px") && ok.stdout.includes("* card: 16px"),
    `Expected override markers in output.\n${ok.stdout}`
  );

  const bad = runNode(["scripts/design-tokens.mjs", "--project", "../../etc"]);
  assert(bad.status !== 0, "Expected invalid slug run to fail");
  assert(
    bad.stderr.includes("Invalid project slug"),
    `Expected invalid slug message.\nSTDERR: ${bad.stderr}`
  );

  console.log("Design token smoke tests passed.");
})();
