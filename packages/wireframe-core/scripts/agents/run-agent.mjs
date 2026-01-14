#!/usr/bin/env node
import path from 'path';

import { getAgentPrompt, prepareAgentPromptFile, repoRoot } from './prompt.mjs';
import { getAgentInfo } from './definitions.mjs';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--agent':
        args.agent = argv[++i];
        break;
      case '--project':
        args.project = argv[++i];
        break;
      case '--write':
        args.write = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default:
        if (!token.startsWith('--')) {
          args._ = args._ || [];
          args._.push(token);
        }
        break;
    }
  }
  return args;
}

function printUsage() {
  console.log(`Agent prompt helper\n\nUsage:\n  node packages/wireframe-core/scripts/agents/run-agent.mjs --agent <name> [--project <slug>] [--write]\n\nOptions:\n  --agent <name>     Agent identifier from AGENT-WORKFLOWS (e.g., brief-analyzer)\n  --project <slug>   Optional project slug for prompt file naming\n  --write            Persist prompt to context/temp-agent-outputs/prompts/\n  --help, -h         Show this help message\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.agent) {
    printUsage();
    if (!args.help) process.exit(1);
    return;
  }

  const agentName = args.agent;
  const info = getAgentInfo(agentName);
  if (!info) {
    console.error(`Unknown agent: ${agentName}`);
    process.exit(1);
  }

  let promptData;
  try {
    promptData = getAgentPrompt(agentName);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  let promptPath = null;
  if (args.write) {
    try {
      promptPath = prepareAgentPromptFile({ agentName, projectSlug: args.project });
    } catch (error) {
      console.error(`Failed to write prompt file: ${error.message}`);
      process.exit(1);
    }
  }

  const outputsSummary = promptData.outputs.map((output) => {
    const requiredMark = output.required ? 'required' : 'optional';
    return `  - ${output.path} (${requiredMark}${output.type ? `, ${output.type}` : ''})`;
  });

  console.log(`Agent: ${promptData.label}\nName: ${promptData.agent}\nDescription: ${promptData.description}\n`);
  console.log('Prompt:\n');
  console.log(promptData.prompt);
  console.log('\nExpected outputs:');
  outputsSummary.forEach((line) => console.log(line));

  if (promptPath) {
    console.log(`\nPrompt file written to ${path.relative(repoRoot, promptPath)}`);
  } else {
    const suggested = `node packages/wireframe-core/scripts/agents/run-agent.mjs --agent ${agentName}${args.project ? ` --project ${args.project}` : ''} --write`;
    console.log(`\nTip: ${suggested}`);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
