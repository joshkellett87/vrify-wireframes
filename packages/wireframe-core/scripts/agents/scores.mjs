export function computeVisualScore(briefAnalysis) {
  if (!briefAnalysis) return { score: 0, reasons: ['missing-analysis'] };

  // Extract text fields where visual guidance actually appears
  // Avoid searching serialized JSON which causes false positives from property names
  const contentReq = briefAnalysis?.contentRequirements || {};
  const projectOverview = briefAnalysis?.projectOverview || {};

  const textFields = [
    contentReq.visualUxNotes || '',
    contentReq.layoutPreferences || '',
    contentReq.interactionNotes || '',
    contentReq.designDirection || '',
    projectOverview.visualDirection || '',
    projectOverview.designNotes || '',
    // Check section-level notes
    ...(briefAnalysis?.sectionStructure || []).map(s => s.visualNotes || ''),
    ...(briefAnalysis?.sectionStructure || []).map(s => s.layoutHints || '')
  ];

  const combined = textFields.join(' ').toLowerCase();
  const reasons = [];
  let score = 0;

  // Use word boundaries to avoid partial matches
  if (/\b(layout|grid|column|flex)\b/.test(combined)) {
    score += 1;
    reasons.push('layout-notes');
  }
  if (/\b(interaction|sticky|animation|hover|scroll|transition)\b/.test(combined)) {
    score += 1;
    reasons.push('interaction-patterns');
  }
  if (/\b(responsive|mobile|tablet|breakpoint|device)\b/.test(combined)) {
    score += 1;
    reasons.push('responsive-guidance');
  }
  if (/\b(accessibility|wcag|contrast|aria|screen.?reader|a11y)\b/.test(combined)) {
    score += 1;
    reasons.push('accessibility');
  }
  if (/\b(hierarchy|emphasis|prominence|weight|focal|z-index)\b/.test(combined)) {
    score += 1;
    reasons.push('visual-hierarchy');
  }

  return { score, reasons };
}

export function computeVariantScore(briefAnalysis) {
  if (!briefAnalysis) return { score: 0, reasons: ['missing-analysis'] };

  // Primary source: routingInputs.variantOutline
  const outline = briefAnalysis?.routingInputs?.variantOutline;

  // Secondary sources for variant information
  const sectionStructure = briefAnalysis?.sectionStructure || [];
  const contentRequirements = briefAnalysis?.contentRequirements || {};

  // Check if there's any variant information from secondary sources
  const hasVariantNotes = sectionStructure.some(s =>
    (s.variantNotes && s.variantNotes.length > 0) ||
    (s.variantSpecific && Object.keys(s.variantSpecific).length > 0)
  );
  const hasVariantPreferences = Boolean(contentRequirements.variantPreferences);

  // If no outline but has secondary variant info, give partial score
  if (!Array.isArray(outline) || outline.length === 0) {
    if (hasVariantNotes || hasVariantPreferences) {
      return { score: 2, reasons: ['variant-hints-in-sections'] };
    }
    return { score: 0, reasons: ['missing-outline'] };
  }

  let score = 0;
  const reasons = [];

  // Check variant count
  if (outline.length >= 3) {
    score += 1;
    reasons.push('variant-count');
  }

  // Check if all variants have names
  if (outline.every(v => typeof v?.name === 'string' && v.name.trim().length > 0)) {
    score += 1;
    reasons.push('names-present');
  }

  // Check if all variants have target segments
  if (outline.every(v => typeof v?.targetSegment === 'string' && v.targetSegment.trim().length > 0)) {
    score += 1;
    reasons.push('target-segments-defined');
  }

  // Check if all variants have differentiators
  if (outline.every(v => typeof v?.differentiator === 'string' && v.differentiator.trim().length > 0)) {
    score += 1;
    reasons.push('differentiators-defined');
  }

  // Check if any variant has a hypothesis
  const hasHypothesisField = outline.some(v => typeof v?.hypothesis === 'string' && v.hypothesis.trim().length > 0);
  if (hasHypothesisField) {
    score += 1;
    reasons.push('hypotheses-present');
  }

  // Bonus: section-level variant notes provide additional context
  if (hasVariantNotes && score < 5) {
    // Don't exceed max score of 5
    score = Math.min(score + 1, 5);
    if (!reasons.includes('section-variant-notes')) {
      reasons.push('section-variant-notes');
    }
  }

  return { score, reasons };
}
