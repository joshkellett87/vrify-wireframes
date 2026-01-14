# Pricing Page V2 — Review Guide

**Created:** 2026-01-07
**Updated:** 2026-01-13
**Status:** Ready for review

---

## Summary

Reimagined VRIFY pricing page with 6 variants exploring different layouts:
- **Layout A (4 variants)**: Stacked vertical with banner or card Data Uploader
- **Layout B (2 variants)**: Foundation band + side-by-side products

---

## Variant Matrix

| ID | Data Uploader | Products | Modules |
|----|---------------|----------|---------|
| **A1** | Banner | Stacked | Nested Cards |
| **A2** | Banner | Stacked | Inline Sections |
| **A3** | Card | Stacked | Nested Cards |
| **A4** | Card | Stacked | Inline Sections |
| **B1** | Foundation Band | Side-by-Side | Nested Cards |
| **B2** | Foundation Band | Side-by-Side | Inline Sections |

---

## Routes

```
/vrify-pricing-v2                  # Index
/vrify-pricing-v2/banner-nested    # A1
/vrify-pricing-v2/banner-inline    # A2
/vrify-pricing-v2/stacked-nested   # A3
/vrify-pricing-v2/stacked-inline   # A4
/vrify-pricing-v2/foundation-nested  # B1
/vrify-pricing-v2/foundation-inline  # B2
```

---

## Review Checklist

For each variant, verify:
- [ ] Data Uploader appears at top (banner or card style per variant)
- [ ] VRIFY Predict appears before VRIFY Present
- [ ] Module display matches variant type (nested cards vs inline)
- [ ] Compact padding throughout (reduced from v1)
- [ ] Per-product CTAs visible
- [ ] Shared sections present (Logo Row, How It Works, FAQ, Testimonial, Final CTA)

---

## Reference Materials

- **V2 Design mockup**: `context/temp/screenshots/pricing-page-v2-reference.png`
