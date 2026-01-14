/**
 * Metadata validation utilities
 * Runtime validation for wireframe metadata.json files
 *
 * @typedef {Object} ValidationError
 * @property {string} field
 * @property {string} message
 * @property {'error'|'warning'} severity
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {ValidationError[]} errors
 * @property {ValidationError[]} warnings
 */

/**
 * Validate metadata.json against schema v2.0 requirements
 * @param {any} metadata
 * @param {Object} [options]
 * @param {any} [options.businessContext] - Parsed business-context export
 * @returns {ValidationResult}
 */
export function validateMetadata(metadata, options = {}) {
  /** @type {ValidationError[]} */
  const errors = [];
  /** @type {ValidationError[]} */
  const warnings = [];
  const { businessContext } = options;

  const contextGoalIds = new Set();
  const contextPersonaIds = new Set();
  const contextKpiIds = new Set();

  if (businessContext) {
    const goalCollections = [
      ...(businessContext.shortTermObjectives || []),
      ...(businessContext.midTermObjectives || []),
      ...(businessContext.successMetrics || [])
    ];
    goalCollections.forEach(entry => {
      if (entry && entry.id) {
        contextGoalIds.add(entry.id);
      }
    });

    (businessContext.keyPerformanceIndicators || []).forEach(entry => {
      if (entry && entry.id) {
        contextKpiIds.add(entry.id);
      }
    });

    (businessContext.personas || []).forEach(persona => {
      if (persona && persona.id) {
        contextPersonaIds.add(persona.id);
      }
    });
  }

  // === Required Fields ===
  if (!metadata.id) {
    errors.push({ field: 'id', message: 'Missing required field: id', severity: 'error' });
  }
  if (!metadata.slug) {
    errors.push({ field: 'slug', message: 'Missing required field: slug', severity: 'error' });
  }
  if (!metadata.title) {
    errors.push({ field: 'title', message: 'Missing required field: title', severity: 'error' });
  }
  if (!metadata.description) {
    warnings.push({
      field: 'description',
      message: 'Missing description field',
      severity: 'warning'
    });
  }

  // === Schema Version ===
  if (!metadata.schema_version) {
    warnings.push({
      field: 'schema_version',
      message: 'Missing schema_version (legacy v1.x format detected)',
      severity: 'warning'
    });
  } else if (metadata.schema_version !== "2.0") {
    warnings.push({
      field: 'schema_version',
      message: `Schema version ${metadata.schema_version} may not be fully supported (expected: "2.0")`,
      severity: 'warning'
    });
  }

  // === Versioning Fields ===
  if (!metadata.version) {
    warnings.push({
      field: 'version',
      message: 'Missing version field',
      severity: 'warning'
    });
  }
  if (!metadata.lastUpdated) {
    warnings.push({
      field: 'lastUpdated',
      message: 'Missing lastUpdated field',
      severity: 'warning'
    });
  }

  // === Variants Validation ===
  if (!metadata.variants) {
    errors.push({
      field: 'variants',
      message: 'Missing required field: variants',
      severity: 'error'
    });
  } else if (typeof metadata.variants !== 'object' || Array.isArray(metadata.variants)) {
    errors.push({
      field: 'variants',
      message: 'variants must be an object (not an array). Use migration script to convert.',
      severity: 'error'
    });
  } else if (Object.keys(metadata.variants).length === 0) {
    // Allow empty variants for single-variant projects
    if (metadata.projectType !== 'single-variant') {
      errors.push({
        field: 'variants',
        message: 'At least one variant is required (or set projectType: "single-variant")',
        severity: 'error'
      });
    }
  } else {
    // Validate each variant
    Object.entries(metadata.variants).forEach(([key, variant]) => {
      if (!variant || typeof variant !== 'object') {
        errors.push({
          field: `variants.${key}`,
          message: `Variant "${key}" must be an object with variant details`,
          severity: 'error'
        });
        return;
      }

      if (!variant.name) {
        errors.push({
          field: `variants.${key}.name`,
          message: `Variant "${key}" missing required field: name`,
          severity: 'error'
        });
      }

      if (typeof variant.component !== 'undefined' && typeof variant.component !== 'string') {
        warnings.push({
          field: `variants.${key}.component`,
          message: `Variant "${key}" component should be a string (relative path/name without extension)`,
          severity: 'warning'
        });
      }
      // Warn if 'path' field is present (should be auto-derived)
      if (variant.path) {
        warnings.push({
          field: `variants.${key}.path`,
          message: `Variant "${key}" has deprecated 'path' field (paths are auto-derived in v2.0)`,
          severity: 'warning'
        });
      }

      const businessRef = variant.businessContextRef;
      if (businessContext) {
        if (!businessRef) {
          warnings.push({
            field: `variants.${key}.businessContextRef`,
            message: `Variant "${key}" is missing businessContextRef. Link goals/personas to ensure alignment checks.`,
            severity: 'warning'
          });
        } else {
          if (
            typeof businessRef.goalIds !== 'undefined' &&
            !Array.isArray(businessRef.goalIds)
          ) {
            warnings.push({
              field: `variants.${key}.businessContextRef.goalIds`,
              message: `Variant "${key}" businessContextRef.goalIds must be an array of goal IDs`,
              severity: 'warning'
            });
          } else if (Array.isArray(businessRef.goalIds) && businessRef.goalIds.length > 0) {
            if (contextGoalIds.size === 0) {
              warnings.push({
                field: `variants.${key}.businessContextRef.goalIds`,
                message: `Variant "${key}" references goal IDs but no goals were found in the exported business context. Run export-business-context before validating.`,
                severity: 'warning'
              });
            } else {
              const unknownGoals = businessRef.goalIds.filter(id => !contextGoalIds.has(id));
              if (unknownGoals.length > 0) {
                warnings.push({
                  field: `variants.${key}.businessContextRef.goalIds`,
                  message: `Variant "${key}" references unknown goal IDs: ${unknownGoals.join(', ')}`,
                  severity: 'warning'
                });
              }
            }
          }

          if (
            typeof businessRef.personaIds !== 'undefined' &&
            !Array.isArray(businessRef.personaIds)
          ) {
            warnings.push({
              field: `variants.${key}.businessContextRef.personaIds`,
              message: `Variant "${key}" businessContextRef.personaIds must be an array of persona IDs`,
              severity: 'warning'
            });
          } else if (Array.isArray(businessRef.personaIds) && businessRef.personaIds.length > 0) {
            if (contextPersonaIds.size === 0) {
              warnings.push({
                field: `variants.${key}.businessContextRef.personaIds`,
                message: `Variant "${key}" references persona IDs but none were found in the exported business context.`,
                severity: 'warning'
              });
            } else {
              const unknownPersonas = businessRef.personaIds.filter(id => !contextPersonaIds.has(id));
              if (unknownPersonas.length > 0) {
                warnings.push({
                  field: `variants.${key}.businessContextRef.personaIds`,
                  message: `Variant "${key}" references unknown persona IDs: ${unknownPersonas.join(', ')}`,
                  severity: 'warning'
                });
              }
            }
          }
        }
      } else if (businessRef) {
        warnings.push({
          field: `variants.${key}.businessContextRef`,
          message: `Variant "${key}" includes businessContextRef but the exported business context JSON was not supplied to the validator.`,
          severity: 'warning'
        });
      }
    });
  }

  // === Sections Validation ===
  if (!metadata.sections) {
    warnings.push({
      field: 'sections',
      message: 'No sections defined',
      severity: 'warning'
    });
  } else if (!Array.isArray(metadata.sections)) {
    errors.push({
      field: 'sections',
      message: 'sections must be an array',
      severity: 'error'
    });
  } else {
    // Validate each section
    metadata.sections.forEach((section, index) => {
      if (!section.name) {
        errors.push({
          field: `sections[${index}].name`,
          message: `Section ${index} missing required field: name`,
          severity: 'error'
        });
      }
      if (!section.anchor) {
        errors.push({
          field: `sections[${index}].anchor`,
          message: `Section ${index} missing required field: anchor`,
          severity: 'error'
        });
      }
    });

    // Check for duplicate anchors
    const anchors = metadata.sections.map(s => s.anchor).filter(Boolean);
    const duplicates = anchors.filter((a, i) => anchors.indexOf(a) !== i);
    if (duplicates.length > 0) {
      errors.push({
        field: 'sections',
        message: `Duplicate anchors found: ${[...new Set(duplicates)].join(', ')}`,
        severity: 'error'
      });
    }
  }

  // === Target Audience ===
  if (!metadata.targetAudience) {
    warnings.push({
      field: 'targetAudience',
      message: 'Missing targetAudience field',
      severity: 'warning'
    });
  } else if (!Array.isArray(metadata.targetAudience)) {
    errors.push({
      field: 'targetAudience',
      message: 'targetAudience must be an array',
      severity: 'error'
    });
  }

  // Warn if using old field name
  if (metadata.targetAudiences && !metadata.targetAudience) {
    warnings.push({
      field: 'targetAudiences',
      message: 'Field "targetAudiences" is deprecated, use "targetAudience" instead',
      severity: 'warning'
    });
  }

  // === Business Context Linkage ===
  if (metadata.businessContext) {
    const bc = metadata.businessContext;
    if (typeof bc !== 'object' || Array.isArray(bc)) {
      warnings.push({
        field: 'businessContext',
        message: 'businessContext should be an object containing goal/persona IDs',
        severity: 'warning'
      });
    } else {
      if (typeof bc.goals !== 'undefined' && !Array.isArray(bc.goals)) {
        warnings.push({
          field: 'businessContext.goals',
          message: 'businessContext.goals must be an array of goal IDs',
          severity: 'warning'
        });
      } else if (Array.isArray(bc.goals) && bc.goals.length > 0) {
        if (businessContext && contextGoalIds.size > 0) {
          const unknownGoals = bc.goals.filter(id => !contextGoalIds.has(id));
          if (unknownGoals.length > 0) {
            warnings.push({
              field: 'businessContext.goals',
              message: `businessContext.goals references unknown goal IDs: ${unknownGoals.join(', ')}`,
              severity: 'warning'
            });
          }
        } else if (businessContext) {
          warnings.push({
            field: 'businessContext.goals',
            message: 'businessContext.goals populated but no goals found in exported business context JSON.',
            severity: 'warning'
          });
        }
      }

      if (typeof bc.personas !== 'undefined' && !Array.isArray(bc.personas)) {
        warnings.push({
          field: 'businessContext.personas',
          message: 'businessContext.personas must be an array of persona IDs',
          severity: 'warning'
        });
      } else if (Array.isArray(bc.personas) && bc.personas.length > 0) {
        if (businessContext && contextPersonaIds.size > 0) {
          const unknownPersonas = bc.personas.filter(id => !contextPersonaIds.has(id));
          if (unknownPersonas.length > 0) {
            warnings.push({
              field: 'businessContext.personas',
              message: `businessContext.personas references unknown persona IDs: ${unknownPersonas.join(', ')}`,
              severity: 'warning'
            });
          }
        } else if (businessContext) {
          warnings.push({
            field: 'businessContext.personas',
            message: 'businessContext.personas populated but no personas were found in the exported business context JSON.',
            severity: 'warning'
          });
        }
      }

      if (typeof bc.kpis !== 'undefined' && !Array.isArray(bc.kpis)) {
        warnings.push({
          field: 'businessContext.kpis',
          message: 'businessContext.kpis must be an array of KPI IDs',
          severity: 'warning'
        });
      } else if (Array.isArray(bc.kpis) && bc.kpis.length > 0) {
        if (businessContext && contextKpiIds.size > 0) {
          const unknownKpis = bc.kpis.filter(id => !contextKpiIds.has(id));
          if (unknownKpis.length > 0) {
            warnings.push({
              field: 'businessContext.kpis',
              message: `businessContext.kpis references unknown KPI IDs: ${unknownKpis.join(', ')}`,
              severity: 'warning'
            });
          }
        } else if (businessContext) {
          warnings.push({
            field: 'businessContext.kpis',
            message: 'businessContext.kpis populated but no KPIs were found in the exported business context JSON.',
            severity: 'warning'
          });
        }
      }

      if (bc.primaryGoal) {
        if (typeof bc.primaryGoal !== 'string') {
          warnings.push({
            field: 'businessContext.primaryGoal',
            message: 'businessContext.primaryGoal must be a goal ID string',
            severity: 'warning'
          });
        } else if (businessContext && contextGoalIds.size > 0 && !contextGoalIds.has(bc.primaryGoal)) {
          warnings.push({
            field: 'businessContext.primaryGoal',
            message: `businessContext.primaryGoal references unknown goal ID "${bc.primaryGoal}"`,
            severity: 'warning'
          });
        }
      }
    }
  } else if (businessContext) {
    warnings.push({
      field: 'businessContext',
      message: 'Business context export detected but metadata is missing businessContext linkage. Populate businessContext.goals/personas to link requirements.',
      severity: 'warning'
    });
  }

  // === Routes Validation ===
  if (!metadata.routes) {
    errors.push({
      field: 'routes',
      message: 'Missing required field: routes',
      severity: 'error'
    });
  } else {
    if (!metadata.routes.index) {
      errors.push({
        field: 'routes.index',
        message: 'Missing required field: routes.index',
        severity: 'error'
      });
    }

    // Warn if routes.variants is present (should be auto-derived)
    if (metadata.routes.variants) {
      warnings.push({
        field: 'routes.variants',
        message: 'routes.variants is deprecated (auto-derived from variants in v2.0)',
        severity: 'warning'
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate that metadata matches schema
 * @param {any} metadata
 * @returns {boolean}
 */
export function isValidMetadata(metadata, options = {}) {
  const result = validateMetadata(metadata, options);
  return result.valid;
}

/**
 * Get a human-readable validation report
 * @param {ValidationResult} result
 * @returns {string}
 */
export function getValidationReport(result) {
  const lines = [];

  if (result.valid && result.warnings.length === 0) {
    return '✅ Valid metadata (no errors or warnings)';
  }

  if (result.errors.length > 0) {
    lines.push('❌ Errors:');
    result.errors.forEach(err => {
      lines.push(`   - ${err.field}: ${err.message}`);
    });
  }

  if (result.warnings.length > 0) {
    lines.push('⚠️  Warnings:');
    result.warnings.forEach(warn => {
      lines.push(`   - ${warn.field}: ${warn.message}`);
    });
  }

  return lines.join('\n');
}
