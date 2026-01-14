# DORA Platform Wireframe - Design Improvement Analysis

## Comparison: Original Platform vs. Current Wireframe

### Visual Analysis from Screenshot

#### 1. Hero Section

**Original Design:**

- Very dark background (#0a1107 - nearly black with slight green tint)
- Large, bold headline: "Find the unfound."
- Descriptive paragraph with good line-height
- Prominent orange CTA button
- Large visual on right showing 3D geospatial data visualization
- Trust bar below with partner logos on very dark green background

**Improvements Needed:**

- Increase heading font size (currently 4xl/5xl, should be 5xl/6xl)
- Improve visual placeholder to suggest 3D data visualization context
- Darken trust bar background to match original (#0a0f07)
- Add more prominent visual separation between hero and trust sections

---

#### 2. How It Works Section

**Original Design:**

- Dark background with subtle variations per step
- Image-left, content-right layout for each step
- Step numbers in brackets: [ 1 ], [ 2 ], etc.
- Large, clear step titles (24px+)
- Ample white space between steps
- Consistent image aspect ratio (approximately 4:3)
- Images show actual DORA interface screenshots

**Improvements Needed:**

- Alternate background shades subtly between steps (#0f1b11 → #0c1309 → #0f1b11)
- Increase spacing between steps (currently 16, should be 20-24)
- Make step titles larger and bolder (currently 2xl, should be 3xl)
- Improve visual placeholder context (data tables, 3D visualizations, charts)

---

#### 3. Discover DORA Strip

**Original Design:**

- Full-width dark section with centered text
- Simple, prominent "DISCOVER DORA" text
- Likely clickable/interactive element

**Current Status:**

- Implemented correctly
- Could use slightly darker background for better contrast

---

#### 4. Case Study Section

**Original Design:**

- Clean white background
- Left: Heading + case study card with orange accents
- Right: Large supporting image (landscape/aerial photo)
- Case study card has border, subtle shadow
- Clear visual hierarchy with "CASE STUDIES" label

**Improvements Needed:**

- Tighten grid gap between left content and right image (currently 12, should be 8-10)
- Make case study heading larger (currently 3xl, should be 4xl)
- Increase prominence of case study card border

---

#### 5. Benefits Section

**Original Design:**

- White background continuing from case study
- Large section heading about "black box" AI
- 2-column grid with 4 benefit cards
- Each card has: number (01-04), title, description
- Cards have subtle borders and minimal shadows
- Orange accent color for numbers

**Current Status:**

- Well implemented
- Could improve card padding and spacing for better breathing room
- Increase heading size for more impact

---

#### 6. Testimonials Section

**Original Design:**

- Dark background (very dark green/black)
- Large testimonial quote in white
- Attribution with name, title, company
- Navigation arrows (PREV / NEXT) with counter
- Centered layout with good typography

**Current Status:**

- Need to verify current implementation
- Should use larger quote font size (3xl-4xl)
- Background should match hero darkness (#0a1107)

---

#### 7. Primary CTA Section

**Original Design:**

- Dark background with large "START DISCOVERING." text
- "SEE VRIFY IN ACTION" label above
- Prominent "BOOK A DEMO" orange button
- Strong visual hierarchy
- Generous padding

**Current Status:**

- Need to verify current implementation
- Should use very large heading (5xl-6xl)
- CTA button should be prominent and centered

---

## Design System Refinements

### Color Palette (Extracted from Screenshot)

```
Dark Backgrounds:
- Primary dark: #0a1107 (hero, testimonials, CTA)
- Secondary dark: #0f1b11 (how it works)
- Tertiary dark: #0c1309 (alternating steps)
- Trust bar: #0a0f07 (even darker)

Light Backgrounds:
- Primary light: #ffffff (case study, benefits)
- Light accent: #f5f7f1 (image placeholders)

Accent Colors:
- Primary orange: #f97316
- Hover orange: #fb923c
- Text muted: rgba(255, 255, 255, 0.7-0.8) on dark
- Text muted: rgba(28, 40, 21, 0.8) on light

Borders:
- Dark sections: rgba(255, 255, 255, 0.1)
- Light sections: #d0d7cb
```

### Typography Scale Updates

```
- Massive headings (hero, CTA): text-5xl md:text-6xl (48px → 60px)
- Large headings (section titles): text-4xl md:text-5xl (36px → 48px)
- Medium headings (step titles): text-3xl (30px)
- Small headings (card titles): text-xl md:text-2xl (20px → 24px)
- Labels (uppercase): text-xs tracking-[0.35em]
- Body: text-base md:text-lg (16px → 18px)
- Small body: text-sm md:text-base (14px → 16px)
```

### Spacing Rhythm (8px baseline)

```
- Section padding: py-24 md:py-32 (192px → 256px)
- Between major elements: gap-16 md:gap-20 (128px → 160px)
- Between cards: gap-6 md:gap-8 (48px → 64px)
- Within cards: gap-4 md:gap-6 (32px → 48px)
- Card padding: p-6 md:p-8 (48px → 64px)
```

### Layout Improvements

```
How It Works:
- Grid: md:grid-cols-[minmax(0,420px)_1fr] (give image more space)
- Gap between image and content: gap-8 md:gap-12
- Spacing between steps: gap-20 md:gap-24

Case Study:
- Grid: md:grid-cols-[minmax(0,480px)_1fr]
- Tighter gap: gap-8 md:gap-10

Benefits:
- Grid: md:grid-cols-2 with gap-6 md:gap-8
- Card styling: increase padding to p-6 md:p-8
```

---

## Implementation Priority

### High Priority (Core Visual Fidelity)

1. ✅ Update color values to match exact dark backgrounds
2. ✅ Increase heading sizes across all sections
3. ✅ Adjust spacing/gaps in How It Works for better rhythm
4. ✅ Improve case study section layout
5. ✅ Enhance visual placeholder context

### Medium Priority (Polish)

1. Fine-tune typography line-heights
2. Add subtle background variations between How It Works steps
3. Improve card shadows and borders
4. Verify testimonials and CTA sections match original

### Low Priority (Enhancement)

1. Add hover states and transitions
2. Improve mobile responsive breakpoints
3. Add micro-interactions

---

## Next Steps

1. Update component files with refined design tokens
2. Regenerate HeroSection with larger headings
3. Regenerate HowItWorksSection with better layout and spacing
4. Regenerate CaseStudySection with tighter layout
5. Review TestimonialsSection and PrimaryCTASection implementations
6. Test in browser with Playwright MCP
7. Iterate based on visual comparison
