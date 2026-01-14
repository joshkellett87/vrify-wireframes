import assert from 'node:assert/strict';
import { parseBusinessContext } from '../export-business-context.mjs';

const sampleMarkdown = `
# Business Context — Sample Project

*Last Updated: 2025-10-01*
*Gathered by: business-context-gatherer agent*

## Revision History

| Date (YYYY-MM-DD) | Editor | Summary | Source / Ticket |
| ----------------- | ------ | ------- | --------------- |
| 2025-10-01        | Jane D | Kickoff intake call | intake-notes.md |

## Strategic Goals

### Short-Term Objectives (3-6 months)
- Increase demo-to-trial conversion rate from 25% to 35%
- Launch enterprise tier with advanced security features

### Mid-Term Objectives (6-12 months)
- Achieve 100 enterprise customers

### Key Performance Indicators
- MRR growth: 20% month-over-month
- Enterprise deal velocity: 45 days average sales cycle

### Success Metrics for This Project
- Generate 50 qualified demo requests per week

## Target Audiences

### Primary Persona 1: Revenue Operations Lead
- **Profile**: Senior operator who manages GTM systems
- **Pain Points**:
  - Fragmented reporting
  - Manual forecasting updates
- **Motivations**:
  - Automate pipeline insights
  - Improve sales efficiency
- **Decision Role**: Primary buyer, controls budget

### Secondary Audiences
- **Sales Enablement**: Needs fresher assets tied to personas
`;

const parsed = parseBusinessContext(sampleMarkdown);

assert.equal(parsed.revisionHistory.length, 1, 'should capture revision history row');
assert.equal(parsed.shortTermObjectives.length, 2, 'captures short-term objectives');
assert.ok(parsed.shortTermObjectives[0].id, 'short-term objectives include identifiers');
assert.equal(parsed.midTermObjectives.length, 1, 'captures mid-term objectives');
assert.ok(parsed.midTermObjectives[0].label.includes('Achieve'), 'mid-term objective preserves text');
assert.equal(parsed.keyPerformanceIndicators.length, 2, 'captures KPIs');
assert.equal(parsed.successMetrics.length, 1, 'captures project success metrics');
assert.equal(parsed.personas.length, 1, 'captures primary persona block');
assert.equal(parsed.personas[0].painPoints.length, 2, 'captures nested pain points');
assert.equal(parsed.personas[0].motivations.length, 2, 'captures nested motivations');
assert.equal(parsed.secondaryAudiences.length, 1, 'captures secondary audiences section');
assert.ok(parsed.secondaryAudiences[0].id, 'secondary audiences include identifiers');
assert.equal(
  parsed.strategicGoals.shortTerm.length,
  parsed.shortTermObjectives.length,
  'strategic goals short-term mirrors objectives'
);
assert.equal(
  parsed.strategicGoals.midTerm.length,
  parsed.midTermObjectives.length,
  'strategic goals mid-term mirrors objectives'
);
assert.equal(
  parsed.strategicGoals.kpis.length,
  parsed.keyPerformanceIndicators.length,
  'strategic goals KPIs mirrors key performance indicators'
);
assert.equal(
  parsed.strategicGoals.projectSuccessMetrics.length,
  parsed.successMetrics.length,
  'strategic goals project success metrics mirrors success metrics'
);
assert.equal(parsed.targetAudiences.length, parsed.personas.length, 'target audiences derived from personas');
assert.equal(
  parsed.targetAudiences[0].name,
  parsed.personas[0].name,
  'target audience retains persona name'
);

console.log('export-business-context.smoke ✅');
