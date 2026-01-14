import os from 'os';

const DEFAULTS = {
  platform: 'unknown',
  capabilities: {
    parallelExecution: false,
    contextWindow: 80000,
    fileOperations: ['read', 'write', 'edit'],
    stateManagement: 'stateless'
  },
  detected: {}
};

export function detectPlatform(env = process.env) {
  const details = { ...DEFAULTS, detected: {} };

  // Google Antigravity IDE
  const isAntigravity = env.ANTIGRAVITY_CLI_ALIAS ||
    env.GEMINI_CLI_IDE_SERVER_PORT ||
    (env.__CFBundleIdentifier && env.__CFBundleIdentifier.includes('antigravity'));
  if (isAntigravity) {
    details.platform = 'antigravity';
    details.capabilities = {
      parallelExecution: true,
      contextWindow: env.ANTIGRAVITY_MAX_CONTEXT ? Number(env.ANTIGRAVITY_MAX_CONTEXT) : 128000,
      fileOperations: ['read', 'write', 'edit'],
      stateManagement: 'stateless'
    };
    details.detected.hint = env.ANTIGRAVITY_CLI_ALIAS ? 'ANTIGRAVITY_CLI_ALIAS' :
      env.GEMINI_CLI_IDE_SERVER_PORT ? 'GEMINI_CLI_IDE_SERVER_PORT' : '__CFBundleIdentifier';
  }

  // Claude Code (Anthropic)
  if (env.CLAUDECODE || env.CLAUDE_CODE_VERSION || env.CLAUDE_RELEASE || env.ANTHROPIC_API_KEY) {
    details.platform = 'claude-code';
    details.capabilities = {
      parallelExecution: true,
      contextWindow: 200000,
      fileOperations: ['read', 'write', 'edit'],
      stateManagement: 'stateless'
    };
    details.detected.hint = env.CLAUDECODE ? 'CLAUDECODE' :
      env.CLAUDE_CODE_VERSION ? 'CLAUDE_CODE_VERSION' : 'CLAUDE_RELEASE';
  }

  // Codex CLI (OpenAI)
  if (env.CODEX_CLI || env.CODEX_VERSION || env.OPENAI_API_KEY) {
    details.platform = 'codex';
    details.capabilities = {
      parallelExecution: false,
      contextWindow: env.CODEX_MAX_CONTEXT ? Number(env.CODEX_MAX_CONTEXT) : 120000,
      fileOperations: ['read', 'write', 'edit'],
      stateManagement: 'stateless'
    };
    details.detected.hint = env.CODEX_CLI ? 'CODEX_CLI' : env.CODEX_VERSION ? 'CODEX_VERSION' : 'OPENAI_API_KEY';
  }

  details.capabilities.fileOperations = Array.from(new Set(details.capabilities.fileOperations));
  details.detected.hostname = os.hostname();
  return details;
}
