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

- **Grayscale-first palette**: Use neutral grays (`--muted`, `--muted-foreground`, `--annotation`) for 90% of elements
- **Layering & backgrounds**:
  - Section blocks: alternate `surface-default` (pure white) and `surface-muted` (5-8% gray tint) for gentle hierarchy.
  - Feature highlight zones: use `surface-elevated` (12% tint) or apply `shadow-xs` for soft separation without introducing color.
  - Accent bands: reserve `surface-accent` (~16% gray) for testimonials, callouts, or summary strips; keep usage sparse.
- **Placeholder content**: "Lorem ipsum" alternatives welcome; actual copy should be representative, not final
- **Typography hierarchy**: Clear heading levels (H1-H6) with consistent sizing
  - Body text: 14-16px (lean toward 14px for forms and dense content)
  - Line height: 1.5 for body text, 1.2-1.3 for headings
  - Font smoothing: Apply `-webkit-font-smoothing: antialiased` for crisp rendering
- **Font families**: Sans-serif stack (Inter, system-ui, or similar) for primary text; consider monospace for technical data, code snippets, numerical displays
- **Iconography**: Simple, outline-based icons (Lucide React preferred)
- **No photography**: Use placeholder boxes, icons, or simple illustrations only

### Layout & Structure

- **Spacing rhythm**: 4px and 8px increments for flexible, precise control
  - **4px increments** (Tailwind: `p-1`, `gap-1`, `mt-1`): Fine-tuning, tight gaps, subtle adjustments
  - **8px+ increments** (Tailwind: `p-2`, `mt-4`, `gap-6`): Section spacing, component margins, major layout structure
  - Use 4px for polish; default to 8px multiples for structural spacing
- **Vertical rhythm**:
  - Section padding defaults: 64px top/bottom on desktop, 48px on tablet, 32px on mobile.
  - Inter-section spacing: 48px–64px to keep modules distinct (avoid collapsing sections unless separated by an accent band).
  - Align text baselines and component edges to the 4px grid for consistent columns.
- **Container widths**: Centered max-width 1200–1280px with 24px gutters; respect the grid across all sections.
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

### Sections (VRIFY-aligned, non-prescriptive)

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

Each section should answer:

1. **Why Now**: Why this section appears at this point in the flow
2. **JTBD - Situation**: What state is the user in when they reach this section?
3. **JTBD - Motivation**: What does the user want to accomplish?
4. **JTBD - Outcome**: What should the user feel/know/do after this section?

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

### Component Architecture

- **Atomic design**: Reusable UI primitives in `shared/ui/`, composed into feature components
- **Project-specific components**: Keep wireframe-specific components isolated in `wireframes/[project]/components/`
- **Shared patterns**: Header, Footer, Card, Form abstractions live in `shared/components/`

### File Organization

```
src/
├── shared/
│   ├── components/      # WireframeHeader, Footer, Card, etc.
│   ├── ui/              # shadcn-ui primitives
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities, constants
│   └── styles/          # Global CSS, Tailwind config extensions
│
├── wireframes/
│   └── [project-slug]/
│       ├── components/  # Project-specific components
│       ├── pages/       # Route-level components
│       ├── brief.txt    # Original design brief
│       └── metadata.json # Project config (see below)
```

### Metadata Schema

Each wireframe project requires a `metadata.json` file:

```json
{
  "id": "project-slug",
  "title": "Project Title",
  "description": "One-line description for index page",
  "variants": [
    {
      "name": "Option A",
      "slug": "option-a",
      "description": "Form-forward layout",
      "emphasis": "Two-column hero, streamlined overview",
      "when": "Push conversions above the fold"
    }
  ],
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
  "targetAudience": ["Executive sponsor", "Technical evaluator"],
  "lastUpdated": "2025-10-01"
}
```

---

## Development Workflow

### 1. Brief → Prompt (Agent-Assisted)

Use the **Agent Workflows** (see `AGENT-WORKFLOWS.md`) to transform a design brief into an LLM-optimized prompt:

1. **brief-analyzer**: Extracts structure, JTBD, audience, constraints
2. **wireframe-strategist**: Designs 2-3 variants with differentiated emphasis
3. **prompt-generator**: Creates ready-to-use prompt for Lovable or Claude Code

### 2. Initial Generation (LLM or Manual)

- Paste generated prompt into Lovable or Claude Code
- Generate initial wireframe structure
- Review against fundamentals (grayscale, 8px rhythm, accessibility)

### 3. Iteration Loop (Chrome DevTools MCP)

For any design change:

1. **Implement**: Modify React components/styles
2. **Preview**: `npm run dev` → use Chrome DevTools MCP to navigate to the route (`mcp__chrome-devtools__navigate_page`)
3. **Snapshot**: Capture accessibility tree with `mcp__chrome-devtools__take_snapshot` (preferred - no size limits)
4. **Visual Check**: Take a screenshot with `mcp__chrome-devtools__take_screenshot` (viewport only, never full-page)
   - **IMPORTANT**: Never use `fullPage: true` - Claude rejects images over 8000px in any dimension
   - For long pages: take multiple viewport screenshots by scrolling, or rely on snapshots
5. **Validate**: Compare against requirements
6. **Repeat**: Iterate until complete

### 4. Quality Checklist

Before marking a wireframe complete:

- [ ] All routes render without errors
- [ ] Mobile responsive (test 375px, 768px, 1280px widths)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast meets WCAG 2.1 AA (use browser DevTools or axe)
- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] JTBD documented for each section (in metadata or comments)
- [ ] Variant strategy documented (when to use each option)
- [ ] Brief and metadata files included in project directory

---

## Visual Latitude Guidelines

- **Layout first**: Structure, hierarchy, and copy placement stay the primary focus.
- **Tasteful accents allowed**: Subtle shadows, soft gradients, and rounded corners are welcome when they reinforce hierarchy or interaction cues.
- **Keep it grayscale-led**: Maintain neutral palettes; add color sparingly for CTAs, status, or differentiation.
- **Document experiments**: Call out any design-system explorations (e.g., new radii, elevation levels) so the team can evaluate reuse potential.

## Annotation Patterns

- Use a consistent annotation chip (e.g., “Optional Experiment” label with dotted outline) adjacent to components exploring polish beyond baseline.
- Note the intent succinctly: “Optional: gradient hero background”, “Optional: sticky CTA shadow-lg”.
- For accessibility or content warnings, add “Accessibility Check” or “Copy TBD” badges to keep reviewers focused on unresolved items.

---

## Design System Tokens

- **Base tokens**: Shared defaults live in `context/design-system.json` (radius, surfaces, shadows, gradients, borders).
- **Project overrides**: Optional tweaks go in `src/wireframes/<slug>/design-overrides.json` and merge automatically with the base tokens.
- **Runtime helper**: Use `getDesignToken()` from `@/shared/design-system` (or project wrappers) to reference tokens instead of hard-coding values.
- **Review tooling**: Run `npm run design:tokens -- --project <slug>` to inspect merged values and highlight overrides before shipping.
- **Promotion flow**: When an override should become a platform default, copy it into the base JSON and note the change in the design-system changelog (see AGENTS.md).

---

## Anti-Patterns (Avoid These)

### Visual

- ❌ **Distracting high fidelity**: Avoid glossy treatments that overshadow layout clarity; stay within subtle elevations/gradients that support hierarchy.
- ❌ **Color overuse**: Limit color to CTAs and status indicators only
- ❌ **Real imagery**: No photos, videos, or branded graphics
- ❌ **Inconsistent spacing**: Stick to 8px rhythm; avoid arbitrary values

### Content

- ❌ **Final copy**: Wireframes should use representative placeholder text
- ❌ **Over-specification**: Don't lock in exact word counts or pixel-perfect layouts
- ❌ **Missing JTBD**: Every section needs clear user goals and outcomes

### Structure

- ❌ **Too many variants**: More than 3 options creates decision paralysis
- ❌ **Identical variants**: If variants don't test distinct hypotheses, cut to 2
- ❌ **Deep navigation**: Keep hierarchy shallow (max 2-3 levels)

### Technical

- ❌ **Global state**: Avoid Redux, Zustand unless truly needed; keep wireframes simple
- ❌ **API integration**: Mock data is fine; no real backend calls for wireframes
- ❌ **Over-engineering**: No complex animations, lazy loading, or performance optimizations

---

## Maintenance & Iteration

### Version Control

- Use git branches for experimental variants
- Commit after each complete section or meaningful iteration
- Tag releases when stakeholders approve a variant for production adaptation

### Documentation Updates

- Update `metadata.json` whenever sections or variants change
- Keep `brief.txt` in sync if project scope evolves
- Log major changes in a `CHANGELOG.md` within each wireframe directory

### Cross-Project Reuse

- Extract patterns into `shared/components/` when 2+ projects use the same pattern
- Refactor project-specific code only when actively working on that wireframe
- Keep dependencies minimal; avoid adding libraries for one-off features

---

## Example: Legacy Mining Tech Survey Project (Reference Only)

Legacy project lives at `src/wireframes/mining-tech-survey/`. Use it to understand the full pattern; keep it read-only unless a requester explicitly asks for Mining Tech changes.

### Directory Structure

```
src/wireframes/mining-tech-survey/
├── components/
│   ├── HeroSection.tsx
│   ├── KeyFindingsSection.tsx
│   ├── MethodologySection.tsx
│   ├── FormSection.tsx
│   └── FAQSection.tsx
├── pages/
│   ├── Index.tsx              # Variant selector
│   ├── OptionA.tsx            # Form-forward
│   ├── OptionB.tsx            # Highlights-forward
│   └── OptionC.tsx            # Trust-forward
├── brief.txt                  # Original design brief
├── metadata.json              # Project configuration
└── CHANGELOG.md               # Version history
```

### Index Page Features

- Project title: "Mining Tech Survey Report — Wireframe Options"
- 3 variant cards with clear differentiation
- Section structure table (8 sections with JTBD)
- Target audience: Executive sponsors + Technical evaluators
- Last updated date in footer

### Variant Differentiation

- **Option A**: Form above fold, FAQ before form, streamlined overview
- **Option B**: Sticky CTA, findings grouped by theme, mid-page methodology
- **Option C**: Methodology snapshot early, elevated transparency, trust-focused

---

## Resources & References

### Design Systems

- [shadcn/ui](https://ui.shadcn.com/) — Component primitives
- [Radix UI](https://www.radix-ui.com/) — Accessible foundation
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

### Accessibility

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/) — Browser extension

### Frameworks

- [Jobs-To-Be-Done](https://jtbd.info/) — User goal framework
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) — Component composition

---

## Summary Checklist

When creating a new wireframe project, ensure:

- [ ] Index page with 2-3 variant cards
- [ ] Brief summary with sections and JTBD
- [ ] Grayscale palette, 8px rhythm, 12-column grid
- [ ] Mobile responsive across all breakpoints
- [ ] WCAG 2.1 AA compliant (contrast, keyboard nav, semantic HTML)
- [ ] Each variant tests a distinct hypothesis
- [ ] `metadata.json` with project config
- [ ] `brief.txt` with original requirements
- [ ] Chrome DevTools MCP validation screenshots
- [ ] Updated `CLAUDE.md` with project-specific context
