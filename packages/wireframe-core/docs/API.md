# @wireframe/core API Reference

Version: 2.0.1
Last Updated: 2025-10-20

## Table of Contents

- [Components](#components)
  - [WireframeHeader](#wireframeheader)
  - [ErrorBoundary](#errorboundary)
  - [ProgressIndicator](#progressindicator)
  - [Pattern Components](#pattern-components)
  - [UI Primitives](#ui-primitives)
- [Hooks](#hooks)
  - [useToast](#usetoast)
  - [useIsMobile](#useismobile)
- [Utilities](#utilities)
  - [cn](#cn)
  - [Routing](#routing)
  - [Metadata](#metadata)
- [Configuration](#configuration)
  - [Vite Config](#vite-config)
  - [Tailwind Config](#tailwind-config)
  - [TypeScript Config](#typescript-config)
- [Design Tokens](#design-tokens)
- [Types](#types)

---

## Components

### WireframeHeader

Sticky navigation header with responsive mobile menu for wireframe projects.

**Import**:

```typescript
import { WireframeHeader } from '@wireframe/core';
```

**Type Definition**:

```typescript
interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface WireframeHeaderProps {
  basePath: string;
  projectTitle?: string;
  navItems?: NavItem[];
}
```

**Props**:

- `basePath` (required): Base route path for the project (e.g., `/platform-pricing`)
- `projectTitle` (optional): Project display name shown in header
- `navItems` (optional): Additional navigation items beyond default Home + Index

**Example**:

```tsx
import { WireframeHeader } from '@wireframe/core';

function MyProject() {
  return (
    <WireframeHeader
      basePath="/my-project"
      projectTitle="My Wireframe Project"
      navItems={[
        { to: '/my-project/variant-a', label: 'Variant A' },
        { to: '/my-project/variant-b', label: 'Variant B' },
      ]}
    />
  );
}
```

**Default Behavior**:

- Automatically includes "← Home" link to `/`
- Includes project index link using `basePath`
- Responsive mobile hamburger menu
- Active link highlighting

---

### ErrorBoundary

React error boundary component for graceful error handling.

**Import**:

```typescript
import { ErrorBoundary } from '@wireframe/core';
```

**Type Definition**:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Props**:

- `children` (required): Components to wrap with error boundary
- `fallback` (optional): Custom error UI to display when error occurs

**Example**:

```tsx
import { ErrorBoundary } from '@wireframe/core';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

---

### ProgressIndicator

Progress bar component for displaying completion status.

**Import**:

```typescript
import { ProgressIndicator } from '@wireframe/core';
```

**Type Definition**:

```typescript
interface ProgressIndicatorProps {
  value: number;
  className?: string;
}
```

**Props**:

- `value` (required): Progress value between 0-100
- `className` (optional): Additional CSS classes

**Example**:

```tsx
import { ProgressIndicator } from '@wireframe/core';

function UploadProgress({ percent }: { percent: number }) {
  return (
    <div>
      <p>Upload progress: {percent}%</p>
      <ProgressIndicator value={percent} />
    </div>
  );
}

// Custom styling
<ProgressIndicator value={75} className="h-4" />
```

**Features**:

- Automatic value clamping (0-100)
- Smooth transitions
- Accessible (ARIA attributes)
- Customizable height via className

---

### Pattern Components

Reusable wireframe patterns exported from the framework:

**Import**:

```typescript
import {
  MetricCard,
  FeatureGrid,
  TestimonialCard,
  ProcessStep,
  ComparisonTable,
  HeaderShell,
  NavList,
  MobileBurger,
} from '@wireframe/core';
```

**Available Components**:

- `MetricCard`: Display key metrics with icon and label
- `FeatureGrid`: Grid layout for feature lists
- `TestimonialCard`: Customer testimonial with avatar
- `ProcessStep`: Step-by-step process visualization
- `ComparisonTable`: Side-by-side feature comparison
- `HeaderShell`: Header container primitive
- `NavList`: Navigation list component
- `MobileBurger`: Mobile hamburger menu button

See individual component source files in `packages/wireframe-core/src/shared/components/` for detailed props.

---

### UI Primitives

shadcn-ui components built on Radix UI:

**Import**:

```typescript
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Separator,
  Toaster,
  AspectRatio,
  Collapsible,
  // ... 50+ components
} from '@wireframe/core';
```

**Available Components**:

- Layout: `Card`, `Separator`, `AspectRatio`, `Collapsible`
- Forms: `Button`, `Input`, `Label`, `Textarea`, `Checkbox`, `Switch`, `Select`
- Feedback: `Toast`, `Alert`, `Progress`, `Skeleton`
- Overlays: `Dialog`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`
- Navigation: `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`
- Data Display: `Table`, `Badge`, `Avatar`, `Calendar`

See [shadcn-ui documentation](https://ui.shadcn.com/docs/components) for component APIs.

---

## Hooks

### useToast

Toast notification hook for displaying temporary messages.

**Import**:

```typescript
import { useToast, toast } from '@wireframe/core';
```

**Type Definition**:

```typescript
interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

function useToast(): {
  toast: (props: Omit<Toast, 'id'>) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}
```

**Example**:

```tsx
import { useToast } from '@wireframe/core';

function MyComponent() {
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Success!",
      description: "Your form has been submitted.",
    });
  };

  const handleError = () => {
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

**Imperative API**:

```tsx
import { toast } from '@wireframe/core';

// Use anywhere without hook
toast({ title: "Quick notification" });
```

---

### useIsMobile

Hook to detect mobile viewport (< 768px).

**Import**:

```typescript
import { useIsMobile } from '@wireframe/core';
// Alternative alias:
import { useMobile } from '@wireframe/core';
```

**Type Definition**:

```typescript
function useIsMobile(): boolean;
```

**Example**:

```tsx
import { useIsMobile } from '@wireframe/core';

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

**Implementation**:

- Uses `window.matchMedia` with `(max-width: 768px)`
- Updates on window resize
- SSR-safe (returns `false` on server)

---

## Utilities

### cn

Utility for merging Tailwind CSS classes with conflict resolution.

**Import**:

```typescript
import { cn } from '@wireframe/core';
```

**Type Definition**:

```typescript
function cn(...inputs: ClassValue[]): string;
```

**Example**:

```tsx
import { cn } from '@wireframe/core';

function Button({ className, variant }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className
      )}
    />
  );
}

// Handles conflicts correctly
cn("px-2", "px-4") // → "px-4"
cn("text-red-500", "text-blue-500") // → "text-blue-500"
```

**Features**:

- Merges multiple class strings
- Resolves Tailwind class conflicts (last wins)
- Handles conditional classes
- Based on `clsx` + `tailwind-merge`

---

### Routing

Dynamic route generation from metadata files.

**Import**:

```typescript
import {
  generateAllWireframeRoutes,
  generateRoutesFromMetadata,
  discoverWireframeProjects,
  validateRouteUniqueness,
} from '@wireframe/core';
```

#### generateAllWireframeRoutes()

Discovers all wireframe projects and generates React Router routes.

**Type Definition**:

```typescript
function generateAllWireframeRoutes(): WireframeRoute[];

interface WireframeRoute {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
}
```

**Example**:

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { generateAllWireframeRoutes } from '@wireframe/core';

const routes = generateAllWireframeRoutes();
const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}
```

**Behavior**:

- Scans `src/wireframes/*/metadata.json`
- Auto-generates routes for index + variants + resources
- Validates route uniqueness
- Handles 404 errors

#### generateRoutesFromMetadata()

Generate routes for a specific project.

**Type Definition**:

```typescript
function generateRoutesFromMetadata(
  metadata: ProjectMetadata,
  projectSlug: string
): WireframeRoute[];
```

**Example**:

```tsx
import { generateRoutesFromMetadata } from '@wireframe/core';
import metadata from './metadata.json';

const routes = generateRoutesFromMetadata(metadata, 'my-project');
```

#### discoverWireframeProjects()

Discover all wireframe projects in the codebase.

**Type Definition**:

```typescript
function discoverWireframeProjects(): ProjectSummary[];

interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  path: string;
  metadata: ProjectMetadata;
}
```

**Example**:

```tsx
import { discoverWireframeProjects } from '@wireframe/core';

const projects = discoverWireframeProjects();
console.log(`Found ${projects.length} projects`);
```

#### validateRouteUniqueness()

Validate that all routes are unique across projects.

**Type Definition**:

```typescript
function validateRouteUniqueness(routes: WireframeRoute[]): void;
```

**Example**:

```tsx
import { generateAllWireframeRoutes, validateRouteUniqueness } from '@wireframe/core';

const routes = generateAllWireframeRoutes();
validateRouteUniqueness(routes); // Throws if duplicates found
```

---

### Metadata

Metadata validation and migration utilities.

**Import**:

```typescript
import {
  validateMetadata,
  SCHEMA_VERSION,
  deriveVariantRoutes,
  getFullRoutes,
  migrateToV2,
  isSchemaV2,
} from '@wireframe/core';
```

#### validateMetadata()

Validate metadata.json against schema v2.0.

**Type Definition**:

```typescript
function validateMetadata(metadata: unknown): {
  valid: boolean;
  errors: string[];
};
```

**Example**:

```tsx
import { validateMetadata } from '@wireframe/core';
import metadata from './metadata.json';

const result = validateMetadata(metadata);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

#### deriveVariantRoutes()

Automatically derive variant routes from metadata.

**Type Definition**:

```typescript
function deriveVariantRoutes(
  baseSlug: string,
  variants: Record<string, VariantDefinition>
): string[];
```

**Example**:

```tsx
import { deriveVariantRoutes } from '@wireframe/core';

const routes = deriveVariantRoutes('my-project', {
  'variant-a': { label: 'Variant A', ... },
  'variant-b': { label: 'Variant B', ... },
});
// Returns: ['/my-project/variant-a', '/my-project/variant-b']
```

#### getFullRoutes()

Get all routes (index + variants + resources) from metadata.

**Type Definition**:

```typescript
function getFullRoutes(metadata: ProjectMetadata): {
  index: string;
  variants: string[];
  resources: string[];
};
```

**Example**:

```tsx
import { getFullRoutes } from '@wireframe/core';
import metadata from './metadata.json';

const routes = getFullRoutes(metadata);
console.log('Index:', routes.index);
console.log('Variants:', routes.variants);
console.log('Resources:', routes.resources);
```

#### migrateToV2()

Migrate v1.x metadata to v2.0 schema.

**Type Definition**:

```typescript
function migrateToV2(v1Metadata: MetadataV1): MetadataV2;
```

#### isSchemaV2()

Check if metadata uses schema v2.0.

**Type Definition**:

```typescript
function isSchemaV2(metadata: unknown): boolean;
```

---

## Configuration

### Vite Config

Base Vite configuration with SPA setup and path aliases.

**Import**:

```typescript
import { createWireframeViteConfig } from '@wireframe/core/configs/vite';
```

**Type Definition**:

```typescript
import type { UserConfig } from 'vite';

function createWireframeViteConfig(
  overrides?: Partial<UserConfig>
): UserConfig;
```

**Example**:

```typescript
// vite.config.ts
import { createWireframeViteConfig } from '@wireframe/core/configs/vite';
import { componentTagger } from 'lovable-tagger';

export default createWireframeViteConfig({
  plugins: [componentTagger()], // Add project-specific plugins
  server: {
    port: 3000, // Override default port (8080)
  },
});
```

**Default Configuration**:

- App type: SPA
- React plugin with SWC
- Path aliases: `@/` → `./src`, `@wireframe/core` → framework
- Server: port 8080, host mode enabled
- Preview: port 8080

---

### Tailwind Config

Base Tailwind configuration with design tokens and shadcn-ui setup.

**Import**:

```typescript
import { createWireframeTailwindConfig } from '@wireframe/core/configs/tailwind';
```

**Type Definition**:

```typescript
import type { Config } from 'tailwindcss';

function createWireframeTailwindConfig(
  overrides?: Partial<Config>
): Config;
```

**Example**:

```typescript
// tailwind.config.ts
import { createWireframeTailwindConfig } from '@wireframe/core/configs/tailwind';

export default createWireframeTailwindConfig({
  theme: {
    extend: {
      colors: {
        // Project-specific color overrides
        brand: {
          primary: '#FF5733',
          secondary: '#3498DB',
        },
      },
      spacing: {
        // Custom spacing values
        '128': '32rem',
      },
    },
  },
});
```

**Default Configuration**:

- Dark mode: class-based
- Content: scans `src/**/*.{ts,tsx}` + framework components
- Design tokens: colors, spacing, fonts, shadows
- Plugins: tailwindcss-animate
- Container: centered, max-width 1400px

---

### TypeScript Config

Base TypeScript configuration with strict mode and path mappings.

**Import**:

```json
{
  "extends": "@wireframe/core/configs/tsconfig.base.json"
}
```

**Example**:

```json
// tsconfig.json
{
  "extends": "@wireframe/core/configs/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@wireframe/core": ["../../packages/wireframe-core/src"]
    }
  },
  "include": ["src"]
}
```

**Default Configuration**:

- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled
- Path mappings for `@/` and `@wireframe/core`

---

## Design Tokens

Framework design tokens for consistent styling.

**Import**:

```typescript
import { designTokens } from '@wireframe/core';
```

**Available Tokens**:

- Colors (primary, secondary, muted, accent, etc.)
- Spacing (8px baseline rhythm)
- Typography (font families, sizes)
- Shadows
- Border radius
- Transitions

See `packages/wireframe-core/src/shared/design-system/` for full token definitions.

---

## Types

Key TypeScript types exported by the framework:

**Routing Types**:

```typescript
interface WireframeRoute {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
}

interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  path: string;
  metadata: ProjectMetadata;
}
```

**Metadata Types**:

```typescript
interface ProjectMetadata {
  schema_version: "2.0";
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  routes: {
    index: string;
    resources?: string;
  };
  variants: Record<string, VariantDefinition>;
  businessContext?: BusinessContext;
}

interface VariantDefinition {
  label: string;
  name?: string;
  hypothesis?: string;
  emphasis?: string;
  businessContextRef?: {
    goalIds?: string[];
    personaIds?: string[];
  };
}
```

**Component Types**:
See individual component imports for prop type definitions.

---

## Version History

- **2.0.1** (2025-10-20): Added ProgressIndicator component
- **2.0.0** (2025-10-20): Initial framework extraction

See [CHANGELOG.md](../CHANGELOG.md) for full version history.

---

## Related Documentation

- [Migration Guide](./MIGRATION-GUIDE.md) - Migrate from monolithic to framework
- [Metadata Schema](./METADATA-SCHEMA.md) - Complete schema v2.0 reference
- [Routing](./ROUTING.md) - Dynamic routing system details
- [Quick Start](./guides/QUICK-START.md) - 5-minute getting started
- [Workflows](./guides/WORKFLOWS.md) - Common development workflows

---

**API Documentation Version**: 1.0.0
**Last Updated**: 2025-10-20
**Framework Version**: 2.0.1
