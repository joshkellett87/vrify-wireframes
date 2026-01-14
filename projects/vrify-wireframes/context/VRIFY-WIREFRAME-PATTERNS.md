# VRIFY-Specific Wireframe Patterns

## Purpose

This document extends `context/WIREFRAME-FUNDAMENTALS.md` with patterns derived from the VRIFY website design system. Use these guidelines when building wireframes specifically for VRIFY projects to maintain brand consistency while preserving low-fidelity wireframe principles.

**Important**: These patterns should NOT introduce color or high-fidelity design elements. They provide structural, typographic, and UX refinements that align with VRIFY's design language in grayscale.

---

## Border & Contrast Standards

**VRIFY Wireframe Contrast Requirements**:

- **Standard borders**: 70% lightness (`hsl(0, 0%, 70%)`) on white backgrounds
- **Input field borders**: 65% lightness for stronger definition
- **Focus rings**: 50% lightness for high contrast keyboard navigation
- **Card borders**: 70% lightness, consistent with standard borders
- **Placeholder borders (dashed)**: 76% lightness (wireframe-300)
- **Avoid**: Borders lighter than 75% — too faint against white, poor visibility

**Rationale**: Wireframes must be clearly legible. Light gray borders (85%+) create insufficient contrast and appear washed out on white backgrounds. Darker borders (70% or less) ensure components are well-defined without feeling heavy.

**CSS Variables** (from `src/shared/styles/index.css`):

```css
--border: 0 0% 70%;          /* Standard borders */
--input-border: 0 0% 65%;    /* Input field borders */
--card-border: 0 0% 70%;     /* Card outlines */
--ring: 0 0% 50%;            /* Focus rings */
--wireframe-300: 0 0% 76%;   /* Placeholder borders */
```

---

## Typography System

### Font Families

VRIFY uses a multi-font system for different content types:

**For Wireframes (Grayscale Approximations)**:

- **Primary text**: Inter or system-ui (modern, clean sans-serif)
- **Technical/data**: JetBrains Mono or monospace (for metrics, code, specs)
- **Optional**: Use distinct font weights to simulate the variety in VRIFY's type system

### Type Scale

```
H1: 48-56px (Hero titles)
H2: 36-40px (Section headers)
H3: 24-28px (Subsection headers)
H4: 18-20px (Card titles, component headers)
Body: 14-16px (lean toward 14px for forms, data-heavy content)
Small: 12-13px (Captions, metadata, legal text)
```

- Tailwind mapping: `text-5xl` (H1), `text-4xl` (H2), `text-2xl` (H3), `text-xl` (H4), `text-base` (body), `text-sm`/`text-xs` (captions).
- Letter spacing: tighten major headings with `tracking-tight`; keep body copy `tracking-normal` for readability.
- Paragraph width: constrain body text to 65–85ch to avoid overly wide columns.

### Line Height & Spacing

- **Body text**: 1.5 (21-24px for 14-16px text)
- **Headings**: 1.2-1.3 (tighter for visual impact)
- **Monospace/data**: 1.4 (slightly tighter than body for density)

### Font Smoothing

Always apply for crisp rendering:

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
```

---

## Universal Section Taxonomy (VRIFY-aligned)

Use this taxonomy to scaffold any VRIFY web experience (homepage, product pages, solutions, resources) without overfitting to a single report or campaign page.

1) Hero — Value prop + CTA; optional teaser visual
2) Value Proposition — Outcomes for key audiences (e.g., CEOs, Geologists, Investors)
3) How It Works — 3–4 steps (gather/optimize, target, analyze/iterate)
4) Capabilities — Feature pillars aligned to the platform’s strengths
5) Use Cases — By role/company type/industry; link onward to detail pages
6) Proof — Logos, metrics, case studies, awards, certifications
7) Primary CTA — “Book a demo” or equivalent primary conversion
8) Resources — Case studies, articles, docs, events, media

Notes

- Prefer anchor maps that reflect this structure (e.g., #value, #how-it-works, #capabilities, #use-cases, #proof, #cta, #resources)
- Keep sections grayscale and low-fidelity; product imagery is represented by placeholders

### Mapping live pages → universal sections

- Hero → H1 + primary CTA region
- Value Proposition → Outcome bullets for target audiences
- How It Works → Process steps (1–3–4), diagrams become placeholders
- Capabilities → Feature pillars (cards)
- Use Cases → Role/company/industry groupings
- Proof → Logos, metrics, case studies
- Primary CTA → Book a demo / Contact
- Resources → Case studies, articles, docs, events

## Spacing & Layout

### Spacing Scale (4px + 8px System)

VRIFY uses both 4px and 8px increments for precision:

**4px Increments** (Fine-tuning):

- `gap-1` (4px): Tight spacing in button groups, icon-text pairs
- `px-1` (4px): Subtle padding adjustments
- `mt-3` (12px): Between related form elements

**8px+ Increments** (Structural):

- `p-2` (8px): Card padding (small)
- `p-4` (16px): Card padding (medium)
- `p-6` (24px): Section padding
- `p-8` (32px): Large section padding
- `gap-4` (16px): Between form fields
- `gap-6` (24px): Between card elements
- `mt-8` (32px): Between major sections
- `mt-12` (48px): Between page sections
- `mt-16` (64px): Between hero and first section

### Border Radius

Consistent across all components:

- **Inputs, buttons, cards**: 4px (`rounded` in Tailwind)
- **Avoid**: Overly rounded corners (8px+, pill shapes)

### Container Widths

- **Max width**: 1280px (standard across VRIFY)
- **Gutters**: 24px horizontal padding on containers
- **Content width**: ~1232px (1280px - 48px gutters)

---

## Form Design

### Input Fields

```
Height: 56px
Border radius: 4px
Border: 1px solid (neutral gray)
Padding: 16px horizontal
Font size: 14px
Background: White/light gray
```

**States**:

- **Default**: Subtle border, light background
- **Focus**: Darker border (2px), focus ring offset
- **Error**: Red/dark border, error message below (12px text)
- **Disabled**: 30-40% opacity, cursor not-allowed

### Labels

**Floating Label Pattern** (VRIFY-preferred):

- Label sits inside input when empty
- Animates to top-left when focused or filled
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)

**Alternative - Top-Aligned**:

- Label above input (8px gap)
- 12-14px font size
- Neutral gray color

### Form Layout

- **Vertical spacing**: 16-24px between fields
- **Field grouping**: Use 12px gap for tightly related fields (e.g., First Name / Last Name side-by-side)
- **Button alignment**: Left-align or full-width for primary CTA
- **Validation**: Inline error messages (12px, red/dark text) 4px below input

### Example Form Structure

```
┌─────────────────────────────────────┐
│ [Floating Label: Email]             │  ← 56px height
│ user@example.com                     │
└─────────────────────────────────────┘
    ↓ 16-24px gap
┌─────────────────────────────────────┐
│ [Floating Label: Company]            │  ← 56px height
│ ACME Corp                            │
└─────────────────────────────────────┘
    ↓ 16-24px gap
┌─────────────────────────────────────┐
│ GET REPORT →                         │  ← 56px height, uppercase
└─────────────────────────────────────┘
```

---

## Button Design

### Specifications

```
Height: 56px (matches inputs)
Padding: 12-16px horizontal (minimal, refined)
Border radius: 4px
Font size: 14px
Text transform: Uppercase (for primary CTAs)
Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Button Variants

**Primary (Solid)**:

- Dark background (e.g., `bg-foreground`)
- White text
- Hover: Slight scale (1.02) or opacity shift (90%)

**Secondary (Outline)**:

- Transparent/white background
- Dark border (2px)
- Dark text
- Hover: Light background fill

**Ghost (Text-only)**:

- No background, no border
- Dark text
- Underline on hover or subtle background; keep padding minimal (`px-0`) so it reads as a link-style CTA.

### Button States

- **Hover**: Scale to 1.02 or slight background darkening
- **Focus**: 2px outline offset by 2px
- **Disabled**: 30-40% opacity, cursor not-allowed
- **Loading**: Loading spinner, disabled state

### Sticky CTA Bars

- Height: 72px including padding; background `surface-elevated` + `shadow-sm` for separation.
- Content: concise copy plus primary and secondary actions with 16px gap; keep total width within grid gutters.
- Behavior: hide when the primary form / CTA section is ≥50% in view, reappear after ~320px scroll past the conversion block.

---

## Navigation Patterns

### Header/Navbar

**Structure**:

```
┌────────────────────────────────────────────────────────┐
│ [LOGO]    Nav Item 1  Nav Item 2  Nav Item 3    [CTA] │  ← 64-80px height
└────────────────────────────────────────────────────────┘
```

**Specifications**:

- **Height**: 64-80px
- **Logo**: Left-aligned, 24-32px height
- **Nav items**: Horizontal, 16-24px gaps
- **CTA button**: Right-aligned, primary style
- **Mobile**: Hamburger menu at <768px

**Interactions**:

- **Dropdown menus**: Icon rotation (180deg) on open
- **Sticky behavior**: Optional; test with shadow on scroll
- **Focus states**: Clear outline on keyboard navigation

### Page Anchor Navigation

For long-form pages (like report wireframes):

```
┌──────────────────────────────────────────┐
│ Overview | Findings | Methodology | Form │  ← Sticky or inline
└──────────────────────────────────────────┘
```

**Specifications**:

- **Button style**: Ghost or secondary
- **Spacing**: 8-12px gaps between buttons
- **Smooth scroll**: `scroll-behavior: smooth` or JS smooth scroll
- **Active state**: Underline or bold for current section

---

## Card Components

### Basic Card

```
┌─────────────────────────────────┐
│ [Icon/Placeholder]               │  ← 48-64px icon/image area
│                                  │
│ Card Title (18-20px)             │  ← 12px gap
│                                  │
│ Description text in 14px with   │  ← 8px gap
│ 1.5 line height for readability │
│                                  │
│ [Learn More →]                   │  ← Ghost button
└─────────────────────────────────┘
```

**Specifications**:

- **Padding**: 16-24px
- **Border**: 1px solid neutral gray OR subtle shadow
- **Border radius**: 4px
- **Background**: White or very light gray
- **Hover**: Subtle shadow increase or border darkening

### Card Grid

- **Columns**: 2-3 columns on desktop, 1 on mobile
- **Gap**: 24px (Tailwind: `gap-6`)
- **Max width**: Constrained to container (1280px)

---

## Data Visualization & Technical Content

### Metric Display

```
┌────────────────┐
│ 127            │  ← Large number (32-40px, monospace)
│ ACTIVE MINES   │  ← Label (12px, uppercase, neutral gray)
└────────────────┘
```

**Specifications**:

- **Number**: Monospace font, 32-48px, bold
- **Label**: Uppercase, 12px, neutral gray
- **Alignment**: Center or left depending on context
- **Spacing**: 4-8px between number and label

### Chart Placeholders

For wireframes, represent charts with simple boxes:

```
┌─────────────────────────────┐
│ [CHART PLACEHOLDER]         │
│                             │
│ Simple box with border      │
│ Label: "Adoption Trends"    │
│                             │
└─────────────────────────────┘
```

**Optional**: Add simple line graphs using CSS borders or SVG:

- Y-axis: Vertical line (left)
- X-axis: Horizontal line (bottom)
- Data: Simple line connecting points

### Step-by-Step Process

For methodology or process flows:

```
① Step Name          → ② Step Name          → ③ Step Name
  Brief description      Brief description      Brief description
```

**Specifications**:

- **Numbers**: Circled (using border-radius: 50%), 32-40px diameter
- **Arrows**: Simple → or connecting lines
- **Spacing**: 32-48px between steps
- **Alignment**: Horizontal on desktop, vertical stack on mobile

---

## Tabs & Tabbed Content

### Tab Navigation

```
┌─────────┬─────────┬─────────┐
│ Tab 1   │ Tab 2   │ Tab 3   │  ← Active tab: bold + underline
└─────────┴─────────┴─────────┘
┌─────────────────────────────┐
│                             │
│ Tab content area            │  ← 240px fixed height (or auto)
│ (Fixed height: 240px)       │
│                             │
└─────────────────────────────┘
```

**Specifications**:

- **Tab button**: 12-16px padding, ghost style
- **Active state**: Bold text + 2-4px bottom border
- **Content area**: Fixed height (240px) OR auto with min-height
- **Transition**: Fade or slide between tabs (200-300ms)

---

## Interactive States & Transitions

### Hover Effects

```css
/* Buttons, cards, links */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.02); /* Subtle lift */
```

### Focus States

```css
outline: 2px solid currentColor;
outline-offset: 2px;
transition: outline 150ms ease;
```

### Loading States

- **Buttons**: Spinner icon, disabled state, "Loading..." text
- **Forms**: Disabled inputs, overlay with spinner
- **Content**: Skeleton loaders (gray boxes with pulse animation)

### Error States

- **Forms**: Red/dark border, error message below
- **Inline alerts**: Icon + message, 4px border-left accent
- **Toast notifications**: Top-right or bottom-center, auto-dismiss

---

## Accessibility Enhancements

### Keyboard Navigation

- **Tab order**: Logical, top-to-bottom, left-to-right
- **Skip links**: "Skip to main content" at top (visible on focus)
- **Focus trap**: In modals, ensure focus stays within modal

### Screen Reader Support

- **ARIA labels**: On icon-only buttons, decorative elements
- **Live regions**: For dynamic content updates (form errors, toasts)
- **Landmark roles**: `<nav>`, `<main>`, `<aside>`, `<footer>`

### Touch Targets

- **Minimum size**: 44x44px for all interactive elements
- **Spacing**: 8px minimum between touch targets
- **Hover vs. touch**: Test sticky hover states on mobile

---

## Responsive Design

### Breakpoints (Tailwind)

```
sm: 640px   (Small tablets, large phones)
md: 768px   (Tablets)
lg: 1024px  (Small laptops)
xl: 1280px  (Desktops)
```

### Mobile-First Approach

Start with mobile layout, enhance for larger screens:

**Mobile (<768px)**:

- Single column layouts
- Stacked cards
- Hamburger navigation
- Full-width buttons
- Reduced padding (16px vs. 24px)

**Tablet (768px-1024px)**:

- 2-column grids
- Side-by-side form fields (where appropriate)
- Horizontal tab navigation
- Increased padding (20px)

**Desktop (1024px+)**:

- 3-column grids
- Multi-column forms
- Full navigation visible
- Maximum padding (24-32px)

### Testing Checklist

- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1280px (desktop)
- [ ] Test at 1920px (large desktop)
- [ ] Test sticky elements on scroll
- [ ] Test form validation across breakpoints

---

## Dark UI Patterns (Grayscale Only)

VRIFY uses dark backgrounds in some areas. For wireframes, simulate with dark grays:

**Background Colors**:

- **Light mode**: White, light gray (e.g., `bg-background`)
- **Dark sections**: Dark gray (e.g., `bg-muted`, `bg-foreground`)
- **Contrast**: Ensure 4.5:1 contrast for text on dark backgrounds

**Navbar Dark Pattern**:

- Dark background (e.g., `bg-foreground`)
- White text
- Transparent or semi-transparent on scroll

---

## Animation & Motion

### Timing Functions

Prefer cubic-bezier for refined, smooth motion:

```css
/* Standard easing */
cubic-bezier(0.4, 0, 0.2, 1)  /* Recommended for most animations */

/* Alternative easing */
cubic-bezier(0.4, 0, 1, 1)    /* Ease-out (fast start, slow end) */
cubic-bezier(0, 0, 0.2, 1)    /* Ease-in (slow start, fast end) */
```

### Duration Recommendations

- **Quick interactions**: 150-200ms (hover, focus)
- **Standard transitions**: 200-300ms (tabs, accordions)
- **Page transitions**: 300-500ms (modals, page loads)
- **Avoid**: Animations >500ms (feel sluggish)

### Common Animations

```css
/* Button hover */
.button:hover {
  transform: scale(1.02);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Accordion expand */
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-content.open {
  max-height: 500px; /* Or auto with JS */
}
```

---

## Anti-Patterns (VRIFY-Specific)

### What to Avoid

- ❌ **Overly rounded corners**: Stick to 4px, avoid 8px+ or pill shapes
- ❌ **Inconsistent spacing**: Always use 4px/8px increments
- ❌ **Small touch targets**: All interactive elements ≥44x44px
- ❌ **Arbitrary font sizes**: Stick to the defined type scale
- ❌ **Color accents**: Keep wireframes grayscale (no VRIFY orange)
- ❌ **Complex animations**: Keep transitions simple and fast (<300ms)
- ❌ **Mixed label styles**: Choose floating OR top-aligned, not both

### Common Mistakes

- Using 56px inputs but 40px buttons (should match)
- Forgetting cubic-bezier transitions (feels abrupt)
- Over-nesting components (keep structure flat)
- Ignoring mobile breakpoints (test early!)

---

## Implementation Examples

### Example: Form Section (React + Tailwind)

```tsx
<form className="space-y-6 max-w-md">
  {/* Floating label input */}
  <div className="relative">
    <input
      type="email"
      id="email"
      className="w-full h-14 px-4 border border-border rounded bg-background
                 text-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-offset-2"
      placeholder=" "
    />
    <label
      htmlFor="email"
      className="absolute left-4 top-4 text-sm text-muted-foreground
                 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs"
    >
      Email Address
    </label>
  </div>

  {/* Primary CTA */}
  <button
    type="submit"
    className="w-full h-14 px-4 bg-foreground text-background rounded
               text-sm uppercase font-medium
               transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
               hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    Get Report →
  </button>
</form>
```

### Example: Metric Card

```tsx
<div className="p-6 border border-border rounded bg-card">
  <p className="font-mono text-4xl font-bold text-foreground">127</p>
  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
    Active Mines
  </p>
</div>
```

### Example: Step Process

```tsx
<div className="flex flex-col md:flex-row gap-8 md:gap-12">
  {steps.map((step, i) => (
    <div key={i} className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-foreground
                      flex items-center justify-center font-mono font-bold">
        {i + 1}
      </div>
      <div>
        <h4 className="font-semibold text-lg">{step.title}</h4>
        <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
      </div>
    </div>
  ))}
</div>
```

---

## Quick Reference

### Spacing Cheat Sheet

```
4px   = p-1, gap-1, mt-1
8px   = p-2, gap-2, mt-2
12px  = p-3, gap-3, mt-3
16px  = p-4, gap-4, mt-4
24px  = p-6, gap-6, mt-6
32px  = p-8, gap-8, mt-8
48px  = p-12, gap-12, mt-12
64px  = p-16, gap-16, mt-16
```

### Component Heights

```
Input/Button: 56px (h-14)
Navbar: 64-80px (h-16 to h-20)
Tab content: 240px (h-60) or auto
Icon: 24-32px (w-6 h-6 to w-8 h-8)
Metric number: 32-48px (text-3xl to text-5xl)
```

### Border Radius

```
All components: 4px (rounded)
Circular elements: 50% (rounded-full)
```

---

## Summary

This document provides VRIFY-specific refinements to the base wireframe principles. Key takeaways:

1. **Typography**: 14px body text, monospace for data, crisp font smoothing
2. **Spacing**: 4px + 8px system for precision
3. **Forms**: 56px height, floating labels, cubic-bezier transitions
4. **Buttons**: 56px height, uppercase text, minimal padding
5. **Navigation**: Dark navbar patterns, clear focus states
6. **Data display**: Monospace metrics, simple placeholders for charts
7. **Responsive**: Mobile-first, test all breakpoints
8. **Motion**: Cubic-bezier easing, 200-300ms transitions

Use these patterns to build wireframes that feel aligned with VRIFY's design system while maintaining low-fidelity, grayscale aesthetics.
