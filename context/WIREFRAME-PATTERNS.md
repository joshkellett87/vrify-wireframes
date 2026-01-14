# Wireframe Pattern Library

This document provides **starting points and proven approaches** for common wireframe scenarios. These are guides, not rules—adapt based on business context, user research, and creative intuition.

**How to use this library:**

- Start with a pattern that matches your use case
- Understand the underlying **why** (user goals, hierarchy principles)
- Adapt freely when your context demands it
- Document significant deviations to build institutional knowledge

---

## Navigation Patterns

### Principle: Persistent Wayfinding

Users need consistent orientation across pages without sacrificing screen real estate.

**Common approaches:**

**Minimal nav** (logo + CTA)

- When: Single-page experiences, focused conversion paths
- Trade-off: Limited exploration, lower bounce recovery
- Example: Product launch pages, lead capture

**Standard horizontal nav** (logo + 3-5 items + CTA)

- When: Multi-page projects with clear IA
- Trade-off: Works until ~5 items, then feels crowded
- Mobile: Typically collapses to hamburger at ≤768px

**Anchor navigation** (section jumps)

- When: Long single-page layouts with distinct sections
- Trade-off: Users must understand page structure mentally
- Consider: Sticky vs inline based on page length

**When to deviate:**

- Complex IA → Mega menu or sidebar nav
- Visual-first projects → Minimal nav that fades on scroll
- Wizard flows → Stepper with progress indication

**What matters most:**

- Users can answer "where am I?" and "where can I go?"
- Interactive elements are obviously clickable
- Mobile navigation doesn't require precision tapping

---

## Hero Patterns

### Principle: Immediate Value Clarity

The hero's job is to orient visitors and expose the primary action—everything else is secondary.

**Common structures:**

**Two-column (copy + visual)**

```
[60% copy] [40% visual]
```

- Why it works: Balances info density with breathing room
- When: B2B, SaaS, products requiring explanation
- Variations: Swap column widths, reverse on mobile, make visual interactive

**Full-width centered**

```
[Centered, max ~800px]
Large headline
Supporting copy
CTA
```

- Why it works: Maximum impact, minimal distraction
- When: Strong brand recognition, simple value prop
- Variations: Add visual below copy, use background treatment

**Conversion-first (copy + form)**

```
[50% copy] [50% inline form]
```

- Why it works: Reduces friction for high-intent visitors
- When: Lead gen, gated content, free trial signups
- Variations: Make form a modal, add social proof near form

**What matters most:**

- Headline communicates value in <5 seconds
- Primary CTA is obvious (size, position, contrast)
- Visitor knows what happens when they click CTA
- Mobile: Content hierarchy still clear when stacked

**Consider deviating when:**

- Brief explicitly requests different approach
- User research shows your audience has different needs
- You're testing a hypothesis about conversion path
- Visual/video content IS the value (demo, before/after)

---

## Form Patterns

### Principle: Minimize Friction, Maximize Trust

Every field is a barrier—only ask what you truly need at this stage.

**Standard lead capture:**

- Name, Email, [optional context field]
- Why: Balances data collection with completion rates
- When: Top-of-funnel, low commitment offers

**Qualification form:**

- Email, Company, Role, [specific need field]
- Why: Routes leads appropriately, sets expectations
- When: Mid-funnel, consultation requests

**Design considerations:**

- Field height: 56px is generous but consider context (dense admin UI might use 40-48px)
- Spacing: 16-24px between fields—tighter for related fields, wider for distinct sections
- Labels: Top-aligned for scannability, floating for polish (choose one approach per project)
- Validation: Inline errors reduce frustration, but don't over-validate (let users finish typing)

**What matters most:**

- User understands why you're asking for each field
- Errors are actionable ("Use format: <name@company.com>" not "Invalid email")
- Success state is clear (toast + redirect, or confirmation message)
- Required vs optional is obvious

**Deviate when:**

- Multi-step form reduces perceived complexity
- Conditional fields improve relevance
- Visual form builder (configurator, calculator) IS the product

---

## Section Patterns

### Principle: Each Section Has a Job

If you can't articulate the JTBD, the section probably doesn't belong.

**Common section jobs:**

**Capability showcase** (features, benefits, platform overview)

- User's question: "What can this do for me?"
- Common structure: 3-column grid with icon + headline + copy
- Variations: Tabs for different user types, accordion for long lists, comparison table

**Process explanation** (how it works, methodology)

- User's question: "How does this actually work?"
- Common structure: Numbered steps with connectors
- Variations: Timeline, interactive diagram, video placeholder

**Social proof** (testimonials, metrics, logos)

- User's question: "Can I trust this?"
- Common structure: Metric cards + testimonial grid + logo bar
- Variations: Case study deep-dives, video testimonials, certification badges

**Conversion section** (CTA block, form, free trial)

- User's question: "What do I do next?"
- Common structure: Headline + value reinforcement + prominent form/CTA
- Variations: Two-column (benefits + form), minimal (CTA + single line), urgent (countdown timer)

**What matters more than structure:**

- Sequence makes sense (don't ask for conversion before building trust)
- Visual hierarchy guides eye to key information
- Mobile: Content still flows logically when linearized
- Each section advances user toward decision or exit

**Creative deviations:**

- Parallax scrolling for storytelling
- Interactive calculators/configurators
- Gamified progress indicators
- Non-linear exploration (hub-and-spoke navigation)

---

## Interaction Patterns

### Principle: Interactions Should Feel Inevitable

Good interactive patterns make the next action obvious without requiring thought.

**CTA patterns:**

- Primary: High contrast, generous padding (56px height typical, but 40-60px range is fine)
- Secondary: Lower visual weight (outline or ghost style)
- Tertiary: Inline text link
- **Hierarchy**: User should never wonder which button is "the main one"

**Hover/Focus states:**

- Indicate affordance (this is clickable)
- Maintain accessibility (focus must be visible for keyboard users)
- Common treatments: opacity shift, subtle shadow, slight scale
- **What matters**: State change is perceivable, not necessarily which specific effect you use

**Sticky elements:**

- Use when: Users need persistent access to navigation or CTAs
- Avoid when: Sticky elements consume too much screen real estate (especially mobile)
- Common pattern: Hide sticky CTA when conversion section is visible, reappear after user scrolls past it
- **Flexibility**: Adjust scroll thresholds based on actual layout, not magic numbers

**Transitions:**

- Default: 200ms with `cubic-bezier(0.4, 0, 0.2, 1)`
- Why: Perceptible but not sluggish
- When to adjust: Slower for large movements (modals, accordions), faster for micro-interactions
- When to skip: Respect `prefers-reduced-motion`

**What matters most:**

- Interactive elements are obviously interactive
- Feedback is immediate (hover, focus, click)
- Animations clarify rather than decorate
- Keyboard users have equivalent experience to mouse users

---

## Data Display Patterns

### Principle: Clarity Over Decoration

Numbers and data should communicate instantly—resist the urge to over-design.

**When displaying metrics:**

- Use monospace fonts (reinforces precision, improves scannability)
- Big number + small label format
- Consider: Change indicators (+12%), context ("vs last quarter"), or just the number
- Example contexts: Dashboard KPIs, proof section statistics, pricing comparisons

**When displaying comparisons:**

- Align data for scanning (tables, not cards, for >3 options)
- Highlight differences, not similarities
- Use checkmarks/X or Yes/No, avoid vague "Included" wording
- Mobile: Consider accordion cards when tables don't fit

**When displaying processes/timelines:**

- Use visual connectors (arrows, lines) to show flow
- Number steps clearly
- Keep language action-oriented ("Analyze data" not "Data analysis")

**Deviate when:**

- Data IS the product (dashboards, analytics tools) → invest in proper data viz
- Numbers need more context → add annotations, explanations, drill-down
- Comparison is secondary to storytelling → use narrative format with inline stats

---

## Content Patterns

### FAQ Accordion

**When to use:** Addressing common objections or questions without cluttering main sections

**Common approach:**

- Group by concern (pricing, implementation, security, etc.)
- Single-open behavior (close others when opening new)
- Expand icon: Chevron (rotate 180° when open)
- Padding: 16-24px
- Max 8-10 questions (split into tabs if more)

**Consider alternatives:**

- Searchable FAQ page for >15 questions
- Inline Q&A within relevant sections (less context switching)
- Conversational chatbot interface (if interactive support is the goal)

### Resource Card Grid

**When to use:** Blog previews, case studies, downloadable content

**Typical structure:**

```
[Thumbnail placeholder: 16:9 ratio]
[Eyebrow: Category/Date]
[Headline: H4]
[Description: 2 lines, truncate]
[Link: "Read more →"]
```

**Considerations:**

- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Card padding: 24px
- Hover: Subtle shadow-sm + headline color change

**Deviate when:**

- Resources need rich filtering/search (table view might work better)
- Visual content is primary (larger images, less text)
- Timeline matters more than category (chronological list view)

---

## When to Create New Patterns

**Good reasons:**

- User research reveals your audience has unique needs
- Brief explicitly requires different approach
- Testing a hypothesis that challenges conventional wisdom
- Existing patterns demonstrably don't solve the problem

**Bad reasons:**

- "This looks more interesting"
- Avoiding the work of understanding why existing patterns work
- Novelty for its own sake

**If you create something new:**

1. Document the **why**: What problem does this solve?
2. Document the **trade-offs**: What did you gain/lose?
3. Share with team: Might benefit future projects
4. Consider: Should this become a platform pattern?

---

## Animation & Motion

### Standard Transitions

**All interactive elements:**

```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

**When to use slower (300-400ms):**

- Accordions expanding/collapsing
- Modal entry/exit
- Page transitions (if needed)

**When to use faster (100-150ms):**

- Hover state changes
- Focus indicators
- Micro-interactions

### Motion Principles

- **Purposeful only**: Animation should clarify interaction, not decorate
- **Reduced motion**: Respect `prefers-reduced-motion` media query
- **Performance**: Use `transform` and `opacity` (GPU-accelerated)

---

## Accessibility Patterns

### Focus Management

**All interactive elements must have:**

- Visible focus indicator (2px outline, 50% lightness)
- Offset from element edge (2px)
- Smooth transition (150ms)

**Focus order:**

- Follow visual hierarchy top-to-bottom, left-to-right
- Skip links before navigation
- Modal: Trap focus inside when open

### Semantic HTML Landmarks

```html
<header>
  <nav aria-label="Primary navigation">
</header>

<main>
  <section aria-labelledby="hero-heading">
  <section aria-labelledby="features-heading">
</main>

<footer>
```

### ARIA Patterns

- **Accordions**: `aria-expanded`, `aria-controls`
- **Tabs**: `role="tablist"`, `aria-selected`
- **Modals**: `aria-modal`, `aria-labelledby`
- **Form validation**: `aria-invalid`, `aria-describedby` for errors

---

## Using This Library Effectively

**Start here when:**

- You need a quick starting point
- You're new to the project/platform
- Stakeholders expect conventional UX

**Deviate when:**

- Business context demands it
- User research reveals different needs
- You're explicitly testing an alternative hypothesis
- Your creative intuition says there's a better way

**Always:**

- Understand the underlying principles (the "why")
- Document significant deviations (helps future you and teammates)
- Test assumptions (Chrome DevTools MCP validation, user feedback)
- Ask: "Does this serve the user's goals?" before asking "Does this match the pattern?"

---

_This is a living document. As we discover better approaches, we update these patterns._

_Last updated: 2025-10-21_
_Version: 2.0.0_
