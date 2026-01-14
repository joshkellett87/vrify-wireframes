// Re-export shared components and patterns
export * from "./shared/components";
export { WireframeHeader } from "./shared/components/WireframeHeader";
export { ErrorBoundary } from "./shared/components/ErrorBoundary";
export { ProgressIndicator } from "./shared/components/ProgressIndicator";

// UI primitives
export * from "./shared/ui";

// Hooks
export { useToast, toast } from "./shared/ui/use-toast";
export { useIsMobile, useIsMobile as useMobile } from "./shared/hooks/use-mobile";

// Utilities
export { cn } from "./shared/lib/utils";
export * from "./shared/lib/routing";

// Metadata helpers
export { validateMetadata } from "./shared/lib/metadata-validator.mjs";
export {
  SCHEMA_VERSION,
  deriveVariantRoutes,
  getFullRoutes,
  migrateToV2,
  isSchemaV2,
} from "./shared/lib/metadata-schema.mjs";

// Design tokens
export * from "./shared/design-system";
