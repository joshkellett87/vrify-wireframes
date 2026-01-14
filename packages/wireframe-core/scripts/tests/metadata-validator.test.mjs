import { describe, it, expect } from 'vitest';
import { validateMetadata } from '../../src/shared/lib/metadata-validator.mjs';

// Valid baseline metadata
const validMetadata = {
  schema_version: '2.0',
  id: 'test-project',
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test wireframe project',
  version: '1.0.0',
  lastUpdated: '2025-10-06',
  businessContext: {
    primaryGoal: 'success-goal-1',
    goals: ['success-goal-1'],
    personas: ['persona-1'],
    kpis: ['kpi-1']
  },
  variants: {
    'variant-a': {
      name: 'Variant A',
      description: 'First variant',
      emphasis: 'Focus on conversion',
      when: 'Use for warm traffic',
      hypothesis: 'Early CTA increases conversions',
      businessContextRef: {
        goalIds: ['success-goal-1'],
        personaIds: ['persona-1']
      }
    }
  },
  sections: [
    {
      name: 'Hero',
      anchor: 'hero',
      whyNow: 'Orient visitor',
      jtbd: {
        situation: 'User arrives',
        motivation: 'Understand value',
        outcome: 'Decide to engage'
      }
    }
  ],
  targetAudience: ['Enterprise buyers'],
  routes: {
    index: '/test-project'
  },
  projectType: 'multi-variant'
};

// Business context export fixture
const businessContextExport = {
  shortTermObjectives: [{ id: 'success-goal-1', label: 'Goal 1' }],
  personas: [{ id: 'persona-1', name: 'Persona 1' }],
  keyPerformanceIndicators: [{ id: 'kpi-1', label: 'KPI 1' }]
};

describe('validateMetadata', () => {
  describe('valid metadata', () => {
    it('accepts valid metadata with all required fields', () => {
      const result = validateMetadata(validMetadata);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts single-variant project with correct projectType', () => {
      const singleVariant = { ...validMetadata, variants: {}, projectType: 'single-variant' };
      const result = validateMetadata(singleVariant);
      expect(result.valid).toBe(true);
    });

    it('accepts section with complete JTBD', () => {
      const result = validateMetadata(validMetadata);
      expect(result.valid).toBe(true);
    });
  });

  describe('required fields', () => {
    it('fails when slug is missing', () => {
      const missingSlug = { ...validMetadata };
      delete missingSlug.slug;
      const result = validateMetadata(missingSlug);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'slug')).toBe(true);
    });

    it('fails when id is missing', () => {
      const missingId = { ...validMetadata };
      delete missingId.id;
      const result = validateMetadata(missingId);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'id')).toBe(true);
    });

    it('fails without routes.index', () => {
      const noIndex = { ...validMetadata, routes: {} };
      const result = validateMetadata(noIndex);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'routes.index')).toBe(true);
    });
  });

  describe('schema version', () => {
    it('warns about non-2.0 schema version but still passes', () => {
      const invalidSchema = { ...validMetadata, schema_version: '1.0' };
      const result = validateMetadata(invalidSchema);
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.message.includes('2.0'))).toBe(true);
    });
  });

  describe('business context validation', () => {
    it('validates business context refs when export provided', () => {
      const result = validateMetadata(validMetadata, { businessContext: businessContextExport });
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('warns about invalid goal references', () => {
      const invalidRefs = {
        ...validMetadata,
        businessContext: {
          ...validMetadata.businessContext,
          goals: ['nonexistent-goal']
        }
      };
      const result = validateMetadata(invalidRefs, { businessContext: businessContextExport });
      expect(result.warnings.some(w => w.message.includes('nonexistent-goal'))).toBe(true);
    });

    it('warns when variant missing businessContextRef with context provided', () => {
      const noVariantRefs = {
        ...validMetadata,
        variants: {
          'variant-a': {
            name: 'Variant A',
            description: 'First variant',
            emphasis: 'Focus',
            when: 'Use always',
            hypothesis: 'Works'
            // Missing businessContextRef
          }
        }
      };
      const result = validateMetadata(noVariantRefs, { businessContext: businessContextExport });
      expect(result.warnings.some(w => w.field.includes('businessContextRef'))).toBe(true);
    });
  });
});
