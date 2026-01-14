import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

export type WireframeViteOptions = UserConfig;

export function createWireframeViteConfig(overrides: Partial<WireframeViteOptions> = {}): UserConfig {
  const require = createRequire(import.meta.url);

  const { plugins, resolve, server, preview, ...rest } = overrides;
  const { alias: resolveAlias, ...resolveRest } = resolve || {};

  let coreSrcPath = path.resolve(process.cwd(), "./node_modules/@wireframe/core/src");
  try {
    const corePkgPath = require.resolve("@wireframe/core/package.json", {
      paths: [process.cwd()],
    });
    coreSrcPath = path.resolve(path.dirname(corePkgPath), "src");
  } catch (error) {
    const workspaceCandidate = path.resolve(
      process.cwd(),
      "../../packages/wireframe-core/src"
    );
    if (fs.existsSync(workspaceCandidate)) {
      coreSrcPath = workspaceCandidate;
    }
  }

  return defineConfig(({ mode }) => {
    const isDev = mode === "development";

    return {
      appType: "spa",
      plugins: [react(), ...(isDev && plugins ? plugins : [])].filter(Boolean),
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./src"),
          "@wireframe/core": coreSrcPath,
          ...(resolveAlias || {}),
        },
        ...resolveRest,
      },
      server: {
        host: true,
        port: Number(process.env.PORT || 8080),
        strictPort: Boolean(process.env.CI) || process.env.STRICT_PORT === "true",
        ...(server || {}),
      },
      preview: {
        host: true,
        port: Number(process.env.PORT || 8080),
        strictPort: false,
        ...(preview || {}),
      },
      ...rest,
    };
  });
}
