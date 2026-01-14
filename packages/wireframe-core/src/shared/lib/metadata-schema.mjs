/**
 * Wireframe Project Metadata Schema v2.0
 * Minimal, focused schema - advanced features deferred to v2.1+
 *
 * @typedef {Object} WireframeMetadata
 * @property {string} schema_version - Schema version ("2.0")
 * @property {string} id - Kebab-case project identifier
 * @property {string} slug - URL-safe slug (usually same as id)
 * @property {string} title - Human-readable project title
 * @property {string} description - One-line project summary
 * @property {string} version - Semantic version (e.g., "1.2.0")
 * @property {string} lastUpdated - ISO date string (YYYY-MM-DD)
 * @property {Object.<string, Variant>} variants - Variant definitions
 * @property {Section[]} sections - Page sections
 * @property {string[]} targetAudience - Target audience list
 * @property {Routes} routes - Route configuration
 * @property {string} [projectType] - Optional project type
 * @property {Resource[]} [resources] - Optional resources
 * @property {BusinessContextSummary} [businessContext] - Linked business context identifiers
 *
 * @typedef {Object} Variant
 * @property {string} name - Display name
 * @property {string} [description] - Short description
 * @property {string} [emphasis] - What's different
 * @property {string} [when] - When to use
 * @property {string} [hypothesis] - A/B test hypothesis
 * @property {string} [component] - Page component name/path (relative to pages/, without extension)
 * @property {BusinessContextRef} [businessContextRef] - References into business context export
 *
 * @typedef {Object} Section
 * @property {string} name - Section display name
 * @property {string} anchor - URL anchor (without #)
 * @property {string} [whyNow] - Why this section at this point
 * @property {JTBD} [jtbd] - Jobs-To-Be-Done
 * @property {string} [component] - Component filename
 *
 * @typedef {Object} JTBD
 * @property {string} situation - User state
 * @property {string} motivation - What user wants
 * @property {string} outcome - Expected outcome
 *
 * @typedef {Object} Routes
 * @property {string} index - Index route path
 * @property {string[]} [resources] - Resource routes
 *
 * @typedef {Object} Resource
 * @property {string} name
 * @property {string} type
 * @property {string} path
 * @property {string} [description]
 *
 * @typedef {Object} BusinessContextSummary
 * @property {string[]} [goals] - Goal IDs from business-context export
 * @property {string[]} [personas] - Persona IDs from business-context export
 * @property {string[]} [kpis] - KPI IDs from business-context export
 * @property {string} [primaryGoal] - Primary goal ID representing the main conversion aim
 *
 * @typedef {Object} BusinessContextRef
 * @property {string[]} [goalIds] - Goal IDs emphasised by this variant
 * @property {string[]} [personaIds] - Persona IDs prioritised by this variant
 * @property {string} [notes] - Optional alignment note
 */

export const SCHEMA_VERSION = "2.0";

/**
 * Type guard to check if metadata matches v2.0 schema
 * @param {any} metadata
 * @returns {boolean}
 */
export function isSchemaV2(metadata) {
  return metadata?.schema_version === "2.0";
}

/**
 * Derive variant routes from variant keys
 * Auto-generates paths as: /${slug}/${variantKey}
 * @param {WireframeMetadata} metadata
 * @returns {string[]}
 */
export function deriveVariantRoutes(metadata) {
  return Object.keys(metadata.variants || {}).map(
    variantSlug => `/${metadata.slug}/${variantSlug}`
  );
}

/**
 * Get full routes including derived variants
 * Combines stored routes with auto-derived variant paths
 * @param {WireframeMetadata} metadata
 * @returns {{ index: string, variants: string[], resources: string[] }}
 */
export function getFullRoutes(metadata) {
  return {
    index: metadata.routes.index,
    variants: deriveVariantRoutes(metadata),
    resources: metadata.routes.resources || []
  };
}

/**
 * Migrate v1.x metadata to v2.0
 * Handles both array-based and object-based variant formats
 * @param {any} v1Metadata
 * @returns {WireframeMetadata}
 */
export function migrateToV2(v1Metadata) {
  // Handle variants: array → object conversion
  /** @type {Object.<string, Variant>} */
  let variants = {};

  if (Array.isArray(v1Metadata.variants)) {
    // mining-tech-survey format (array of objects)
    v1Metadata.variants.forEach((v) => {
      variants[v.slug] = {
        name: v.name,
        description: v.description,
        emphasis: v.emphasis,
        when: v.when,
        hypothesis: v.hypothesis
      };
    });
  } else if (typeof v1Metadata.variants === 'object' && v1Metadata.variants !== null) {
    // legacy pricing format (already object)
    // Just remove 'path' field if present (now auto-derived)
    Object.entries(v1Metadata.variants).forEach(([key, value]) => {
      variants[key] = {
        name: value.name,
        description: value.description,
        emphasis: value.emphasis,
        when: value.when,
        hypothesis: value.hypothesis
      };
    });
  }

  // Normalize sections (preserve both simple and detailed formats)
  const sections = (v1Metadata.sections || []).map((s) => {
    if (s.whyNow || s.jtbd) {
      // Detailed format (mining-tech-survey) - preserve all fields
      return s;
    } else {
      // Simple format (legacy pricing)
      return {
        name: s.name,
        anchor: s.anchor
      };
    }
  });

  // Normalize targetAudience field name
  const targetAudience = v1Metadata.targetAudience || v1Metadata.targetAudiences || [];

  return {
    schema_version: SCHEMA_VERSION,
    id: v1Metadata.id,
    slug: v1Metadata.slug || v1Metadata.id,
    title: v1Metadata.title,
    description: v1Metadata.description || "No description available",
    version: v1Metadata.version || "1.0.0",
    lastUpdated: v1Metadata.lastUpdated || new Date().toISOString().split('T')[0],

    variants,
    sections,
    targetAudience,

    routes: {
      index: v1Metadata.routes.index,
      resources: v1Metadata.routes.resources
      // NOTE: routes.variants is now DERIVED, not stored
    },

    // Preserve optional fields
    projectType: v1Metadata.projectType,
    resources: v1Metadata.resources,
    businessContext: v1Metadata.businessContext
  };
}
