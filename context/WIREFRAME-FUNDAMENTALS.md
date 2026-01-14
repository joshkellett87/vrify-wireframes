# Wireframe Design Fundamentals

## Core Principles

### 1. Purpose: Design Artifacts, Not User-Facing Pages

Wireframes are **low-fidelity design artifacts** intended for:

- Internal design review and iteration
- Stakeholder alignment on structure and user flow
- A/B test hypothesis generation
- LLM-assisted rapid prototyping

> **Terminology check**: When a request mentions a “wireframe,” confirm whether it refers to a single screen, a variant, or an entire multi-route project before you begin planning.

**What wireframes are NOT:**

- Production-ready applications
- High-fidelity mockups with final copy and imagery
- Marketing pages optimized for SEO or conversion at scale

---

## Design Standards

### Visual Fidelity

**Color & Contrast**

- **Palette**: Grayscale-first (90% neutral grays: `--muted`, `--muted-foreground`, `--annotation`)
- **Layering strategy**:
  - Default blocks: `surface-default` (white)
  - Alternating sections: `surface-muted` (5-8% gray)
  - Feature highlights: `surface-elevated` (12% gray) + `shadow-xs`
  - Accent bands: `surface-accent` (~16% gray) — use sparingly for testimonials/callouts
- **Accent color**: Reserve for CTAs and critical status indicators only

**Typography**

- **Families**: Sans-serif (Inter, system-ui) for UI; monospace for data/metrics
- **Body text**: 14-16px (prefer 14px for forms/dense content)
- **Line height**: 1.5 (body), 1.2-1.3 (headings)
- **Rendering**: Apply `-webkit-font-smoothing: antialiased`
- **Hierarchy**: Clear H1-H6 structure with consistent sizing

**Visual Elements**

- **Icons**: Outline-based only (Lucide React)
- **Imagery**: Placeholder boxes, icons, simple illustrations — no photography
- **Content**: Representative placeholder text (lorem alternatives welcome)

### Layout & Structure

**Spacing System**

Base rhythm: 4px grid for precision, 8px multiples for structure

**When to use 4px increments** (`gap-1`, `p-1`, `mt-1`):

- Fine-tuning alignment
- Tight gaps within components
- Polish adjustments

**When to use 8px+ increments** (`p-2`, `gap-4`, `mt-6`):

- Component margins
- Section spacing
- Layout structure

**Vertical spacing defaults**:

| Context | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Section padding (top/bottom) | 64px | 48px | 32px |
| Inter-section spacing | 48-64px | 40-48px | 32px |
| Component stacking | 16-24px | 16px | 12-16px |

**Rule of thumb**: Default to 8px multiples; reach for 4px only when refining.

**Layout Conventions**

- **Container widths**: Centered max-width 1200–1280px with 24px gutters
- **12-column grid system**: Max width 1280px, 24px gutters
- **Mobile-responsive**: Mobile-first design; test all breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Section-based architecture**: Clear visual separation between page sections
- **Systematic constraints**: Limit to 3-4 font sizes, 2-3 spacing scales, predefined component variants
- **Border radius**: 4px for subtle rounding on cards, inputs, buttons (avoid overly rounded corners)

### Accessibility

- **WCAG 2.1 AA compliance**:
  - Color contrast ≥ 4.5:1 for body text
  - Color contrast ≥ 3:1 for large text (18px+ or 14px+ bold)
  - Color contrast ≥ 3:1 for UI components and focus states
  - **Borders and outlines**: Use sufficient contrast for visibility against white backgrounds
    - Standard borders: 70% lightness (`hsl(0, 0%, 70%)`) — clear, visible edges
    - Input borders: 65% lightness — stronger definition for form fields
    - Focus rings: 50% lightness — high contrast for keyboard navigation
    - Card borders: 70% lightness — consistent with standard borders
    - Avoid borders lighter than 75% (too faint, poor contrast)
- **Keyboard navigation**: All interactive elements must be keyboard accessible
- **Focus indicators**: Visible focus rings on all interactive elements
  - 2px (0.125rem) solid outline, 50% lightness for high contrast
  - Offset from element edge for clarity
  - Smooth transitions on focus state changes
- **Hover/focus parity**: Any hover treatment (shadow, scale, color shift) must have an equivalent visible focus state for keyboard users (e.g., add focus ring + maintain shadow).
- **Semantic HTML**: Use proper heading hierarchy, `<nav>`, `<main>`, `<section>`, etc.
- **Skip links**: Add "Skip to main content" for screen reader users
- **ARIA labels**: Use `aria-label`, `aria-describedby`, `aria-expanded` where appropriate

---

## Wireframe Anatomy

### Required Pages

#### 1. Index Page (Wireframe Selector)

**Purpose**: Present 2-3 layout variants with context
**Required Elements**:

- Page title clearly identifying the project
- 2-3 variant cards (see structure below)
- Brief summary section with:
  - Section structure overview (6-8 sections typical)
  - JTBD (Jobs-To-Be-Done) for each section
  - Target audience and use case
- Header with project branding
- Footer with metadata (last updated, version, etc.)

**Variant Card Structure**:

```
┌─────────────────────────────┐
│ Option A: [Short Name]      │
│ [One-line description]       │
│                              │
│ Emphasis: [What's different] │
│ When to use: [Use case]      │
│                              │
│ [View Wireframe Button] →    │
└─────────────────────────────┘
```

#### 2. Variant Pages (2-3 per project)

**Purpose**: Show different layout approaches emphasizing different user goals
**Required Elements**:

- Same section structure across all variants
- Different emphasis/ordering to test hypotheses
- Clear navigation back to index
- Variant label in header (e.g., "Option A: Form-Forward")

**Variant Strategy**:

- **Minimum**: 2 variants (e.g., conversion-focused vs. information-focused)
- **Maximum**: 3 variants (avoid decision paralysis)
- **Differentiation**: Each variant should test a distinct hypothesis about user behavior or conversion path

---

## Common Wireframe Patterns

### Navigation

- **Header**: Logo/project name + top-level nav (max 5 items) + optional CTA
- **Anchor nav**: Sticky or inline section jumps (use `#section-id` links)
- **Breadcrumbs**: For multi-level wireframes (e.g., Resources → Sub-resource)
- **Mobile menu**: Hamburger icon with slide-out or dropdown navigation

### Sections (pattern-aligned, non-prescriptive)

- **Hero**: Tagline/value and primary CTA (e.g., “Book a Demo”)
- **How It Works**: Platform workflow in steps (data → target → analyze/iterate → visualize)
- **Platform/Capabilities**: Pillars/features/benefits (incl. enterprise-grade notes)
- **Solutions/Use Cases**: By role, company type, or industry; link to solutions pages
- **Proof & Results**: Case studies, testimonials, metrics, awards
- **Resources**: Articles, case studies, events, podcasts
- **CTA Block**: Focused conversion section (“Start discovering”/“Book a Demo”)
- (Optional) **Thought Leadership**: “Innovating the industry” or similar positioning
- **Footer**: Legal links, secondary nav, social placeholders

#### Card Anatomy (Reusable)

```
┌─────────────────────────────┐
│ Eyebrow / meta              │
│ Heading (H4)                │
│ Supporting copy (2-3 lines) │
│                             │
│ [Optional CTA →]            │
└─────────────────────────────┘
```

- Default padding: 24px desktop, 16px mobile; maintain 16px gap between stacked elements.
- Optional experiments: note beside the card (“Optional: elevate with shadow-xs” / “Optional: borderless variant with surface-muted”) so stakeholders can distinguish polish tests from baseline structure.

### Interactive Elements

- **Buttons**:
  - Variants: Primary (solid), Secondary (outline), Ghost (text-only)
  - Height: 56px (matches input fields for visual consistency)
  - Padding: 12-16px horizontal (minimal, refined appearance)
  - Motion tokens: default hover `opacity-90` + optional `shadow-xs`, subtle `scale-102`; transition `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`
  - Text style: Consider uppercase for primary CTAs (optional, brand-specific)
  - Border radius: 4px for subtle rounding
  - Transitions: Use cubic-bezier for smooth, refined animations
    - Example: `transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);`
- **Forms**:
  - Input height: 56px (taller for better touch targets and visual prominence)
  - Field spacing: 16-24px vertical gap between form fields
  - Labels: Floating labels or top-aligned labels with clear hierarchy
  - Border radius: 4px
  - Validation: Inline validation hints with clear error states
  - Minimal fields (2-4 max for wireframes)
- **Accordions**: For hiding secondary content (FAQ, methodology details)
- **Tabs**:
  - For organizing parallel content (e.g., different data views)
  - Fixed height containers (e.g., 240px) for consistent layout
- **Modals**: Use sparingly; prefer inline expansion for wireframes
- **Sticky elements**: CTAs, nav, or notification bars (test scroll behavior)

### Technical Precision & Data Display

- **Monospace fonts**: Use for numerical data, technical specifications, code snippets, metrics
- **Data visualization placeholders**: Simple charts/graphs using lines, boxes, and basic shapes
- **Step-by-step flows**: Numbered sequences with connecting lines for process visualization
- **Tabbed content**: Fixed height containers for consistent layout across tabs
- **Technical imagery**: Placeholder boxes representing 3D visualizations, maps, or data interfaces
- **Metric displays**: Clear hierarchy for numbers, labels, and units

---

## Section Structure Best Practices

### Jobs-To-Be-Done Framework

Each section should answer four questions:

| Question | Purpose | Example (Hero Section) |
|----------|---------|------------------------|
| **Why Now** | Sequence justification | "Orient visitors immediately after landing" |
| **Situation** | User's current state | "Visitor arrives from paid search, uncertain if product fits" |
| **Motivation** | User's goal | "Quickly confirm relevance and understand value proposition" |
| **Outcome** | Success criteria | "User feels confident to explore OR ready to convert" |

**Application guidance**:

- **Early sections** (Hero, How It Works): Focus on orientation and value clarity
- **Mid sections** (Capabilities, Use Cases): Build credibility and demonstrate fit
- **Late sections** (Proof, CTA): Overcome objections and drive conversion
- **Supporting sections** (FAQ, Methodology): Address specific concerns when they arise

**Red flags**:

- Situation doesn't connect to previous section's outcome
- Motivation is vague ("learn more" — more about what?)
- Outcome doesn't advance user toward conversion or exit decision

### Typical Section Order (Adaptable)

1. **Hero**: Value/CTA
2. **How It Works**: Step-by-step workflow overview
3. **Platform/Capabilities**: Pillars, features, benefits (incl. enterprise-grade)
4. **Solutions/Use Cases**: By role/company/industry
5. **Proof & Results**: Case studies/testimonials/metrics
6. **Resources**: Articles/case studies/events/podcast
7. **CTA Block**: Focused conversion section

Notes:

- This is a starting point. Drop/merge/rename as needed to fit the page’s job-to-be-done.
- Case study templates often follow: Challenge → Solution/Process → Results → Future.

---

## Transcription Fidelity

- Normalize live pages into the universal sections: Hero, Value, How It Works, Capabilities, Use Cases, Proof, CTA, Resources
- Copy Mode:
  - Brief-driven (net new): default lorem; do not use real copy unless explicitly requested
  - Page-driven: if using real copy, limit to concise headlines/CTAs; avoid long text dumps to prevent bloat
  - Wireframe iteration: default preserve; you may convert to lorem if abstraction is desired
- Anchors: choose from the universal set; keep consistent across variants
  - Default anchors: #how-it-works, #capabilities, #solutions, #proof, #resources, #cta
  - If you rename or remove sections/anchors, update metadata.json (sections[], anchors, and any anchor-linked routes) accordingly.

## Variant Design Strategy

### Creating Meaningful Variants

Each variant should test a **single hypothesis** by adjusting:

1. **Section order**: What information comes first?
2. **Visual emphasis**: What gets the most space/prominence?
3. **CTA placement**: Above fold, mid-page, or bottom?
4. **Content density**: Minimal vs. comprehensive?

### Example Variant Set (3 Options)

- **Option A: Conversion-Forward**: CTA above fold, streamlined content, FAQ before form
- **Option B: Highlights-Forward**: Sticky CTA, data-driven proof points, mid-page methodology
- **Option C: Trust-Forward**: Methodology early, detailed transparency, social proof throughout

### Naming Conventions

- Use **descriptive names** that hint at strategy: "Form-Forward", "Trust-First", "Data-Driven"
- Avoid generic labels: "Option 1", "Version A" (unless intentionally neutral for testing)
- Include **when to use** guidance for stakeholders selecting variants

---

## Technical Stack Recommendations

### Core Technologies

- **Vite + React**: Fast dev server, minimal config
- **TypeScript**: Type safety for component props and data structures
- **Tailwind CSS**: Utility-first styling aligned with 8px rhythm
- **shadcn-ui**: Accessible, unstyled component primitives (Radix UI)
- **@wireframe/core**: Shared framework package containing UI primitives and utilities

### Component Architecture

- **Framework**: Core components live in `@wireframe/core` (shadcn-ui primitives, Layouts)
- **Shared Project**: Reusable patterns across the project live in `src/shared/components/`
- **Wireframe-Specific**: Project-specific logic lives in `src/wireframes/[slug]/components/`

### File Organization (Monorepo)

```
projects/
└── [project-name]/           # e.g., wireframe-platform-marketing
    ├── src/
    │   ├── wireframes/       # Wireframe instances
    │   │   └── [slug]/
    │   │       ├── components/
    │   │       ├── pages/
    │   │       ├── brief.txt
    │   │       └── metadata.json
    │   ├── shared/           # Project-specific shared pattern
    │
    ├── vite.config.ts        # Extends framework base
    └── tailwind.config.ts    # Extends framework base
```

### Metadata Schema

Each wireframe project requires a `metadata.json` file:

```json
{
  "id": "project-slug",
  "title": "Project Title",
  "description": "One-line description for index page",
  "variants": {
    "option-a": {
      "name": "Option A",
      "description": "Form-forward layout",
      "emphasis": "Two-column hero, streamlined overview",
      "when": "Push conversions above the fold"
    }
  },
  "sections": [
    {
      "name": "Hero",
      "anchor": "hero",
      "whyNow": "Orient visitors and expose primary CTA",
      "jtbd": {
        "situation": "Visitor lands from marketing channel",
        "motivation": "Confirm they're in the right place",
        "outcome": "Confidence to scan or take action"
      }
    }
  ],
  "routes": {
    "index": "/slug"
  },
  "businessContext": {
    "goals": [],
    "personas": []
  },
  "lastUpdated": "2025-10-01"
}
```

---

## Development Workflow

### 1. Brief → Prompt (Agent-Assisted)

Use the **Agent Workflows** (via `npm run orchestrate`) to transform a design brief into an LLM-optimized prompt:

1. **brief-analyzer**: Extracts structure, JTBD, audience, constraints
2. **wireframe-strategist**: Designs 2-3 variants with differentiated emphasis
3. **prompt-generator**: Creates ready-to-use prompt for implementation agents

### 2. Initial Generation (Agent-Driven)

- Agent orchestrator (or `/wf` slash command) runs the generation loop
- Generates initial wireframe structure in `src/wireframes/[slug]`
- Review against fundamentals (grayscale, 8px rhythm, accessibility)

### 3. Iteration Loop (Chrome DevTools MCP)

For any design change, use `npm run self-iterate`:

1. **Implement**: Modify React components/styles
2. **Preview**: `npm run dev` → Chrome DevTools MCP navigates to the route
3. **Snapshot**: Capture accessibility tree with `take_snapshot` (preferred)
4. **Visual Check**: Capture viewport screenshots when visual context is needed
5. **Validate**: Runs `ux-review` and `wireframe-validator` agents
6. **Repeat**: Iterate until `ux-review` score ≥ 80 or user breakdown

**Screenshot Best Practices**:

- **Always**: Use `mcp__chrome-devtools__take_snapshot` for full-page validation
- **Always**: Use viewport screenshots (`mcp__chrome-devtools__take_screenshot`)
- **Never**: Use `fullPage: true` — Claude rejects images over 8000px
- **Context**: Explain what you're validating when taking screenshots

### 4. Quality Checklist

Before marking a wireframe complete:

- [ ] All routes render without errors
- [ ] Mobile responsive (test 375px, 768px, 1280px widths)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] JTBD documented (in metadata or comments)
- [ ] Brief and metadata files included in project directory

---

## Visual Latitude & When to Deviate

### Visual Latitude Guidelines

- **Layout first**: Structure, hierarchy, and copy placement stay the primary focus.
- **Tasteful accents allowed**: Subtle shadows, soft gradients, and rounded corners are welcome.
- **Keep it grayscale-led**: Maintain neutral palettes; add color sparingly.
- **Document experiments**: Call out any design-system explorations.

### When to Deviate from Standards

These fundamentals are strong defaults, not rigid constraints. Break them when:

- Brief explicitly requests elevated fidelity
- Testing visual hierarchy requires strategic color/shadow experiments
- Persona research indicates low-fi wireframes reduce stakeholder confidence

**Documentation requirement:**
When deviating, always document the **Why**, **What**, **How**, and **Validation** plan.

## Annotation Patterns

- Use a consistent annotation chip (e.g., “Optional Experiment” label)
- Note the intent succinctly: “Optional: gradient hero background”
- For accessibility or content warnings, add “Accessibility Check”

---

## Design System Tokens

- **Base tokens**: Shared defaults live in `context/design-system.json` (workspace root).
- **Project overrides**: Optional tweaks go in `src/wireframes/<slug>/design-overrides.json` and merge automatically.
- **Runtime helper**: Use standard Tailwind classes (`rounded-lg`, `shadow-sm`, `bg-muted`) which map to these tokens via the Tailwind configuration.
- **Review tooling**: Run `npm run design:tokens -- --project <slug>` to inspect merged values.
- **Promotion flow**: When an override should become a platform default, update the base JSON.

---

## Anti-Patterns (Avoid These)

### Visual

- ❌ **Distracting high fidelity**: Avoid glossy treatments that overshadow layout clarity
- ❌ **Color overuse**: Limit color to CTAs and status indicators only
- ❌ **Real imagery**: No photos, videos, or branded graphics
- ❌ **Inconsistent spacing**: Stick to 8px rhythm

### Content

- ❌ **Final copy**: Wireframes should use representative placeholder text
- ❌ **Over-specification**: Don't lock in exact word counts or layouts
- ❌ **Missing JTBD**: Every section needs clear user goals and outcomes

### Structure

- ❌ **Too many variants**: More than 3 options creates decision paralysis
- ❌ **Identical variants**: If variants don't test distinct hypotheses, cut to 2
- ❌ **Deep navigation**: Keep hierarchy shallow (max 2-3 levels)

### Technical

- ❌ **Global state**: Avoid Redux/Zustand unless truly needed
- ❌ **API integration**: Mock data is fine; no real backend calls
- ❌ **Over-engineering**: No complex animations or lazy loading

---

## Maintenance & Iteration

### Version Control

- Use git branches for experimental variants
- Commit after each complete section or meaningful iteration
- Tag releases when stakeholders approve a variant

### Documentation Updates

- Update `metadata.json` whenever sections or variants change
- Keep `brief.txt` in sync if project scope evolves
- Log major changes in a `CHANGELOG.md` (or similar)

### Cross-Project Reuse

- Extract patterns into `src/shared/components/` when 2+ projects use the same pattern
- Refactor project-specific code only when actively working on that wireframe

---

## Resources & References

### Design Systems

- [shadcn/ui](https://ui.shadcn.com/) — Component primitives
- [Radix UI](https://www.radix-ui.com/) — Accessible foundation
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

### Accessibility

- [WCAG 2.1 Guidelines](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/) — Browser extension

---

## Summary Checklist

When creating a new wireframe project, ensure:

- [ ] Index page with 2-3 variant cards
- [ ] Brief summary with sections and JTBD
- [ ] Grayscale palette, 8px rhythm, 12-column grid
- [ ] Mobile responsive across all breakpoints
- [ ] WCAG 2.1 AA compliant
- [ ] Each variant tests a distinct hypothesis
- [ ] `metadata.json` with project config
- [ ] `brief.txt` with original requirements
- [ ] Chrome DevTools MCP validation screenshots
- [ ] Updated `AGENTS.md` (automatic via docs build) if contributing to framework
