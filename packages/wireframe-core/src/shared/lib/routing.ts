import React, { lazy, ComponentType } from "react";
import { getFullRoutes } from "./metadata-schema.mjs";

export interface WireframeRoute {
  path: string;
  component: ComponentType;
  exact?: boolean;
}

interface VariantDefinition {
  component?: string;
  [key: string]: unknown;
}

export interface ProjectMetadata {
  id: string;
  title: string;
  slug: string;
  description?: string;
  routes: {
    index: string;
    variants?: string[]; // Deprecated: auto-derived from variants in v2.0
    resources?: string[];
    [key: string]: string | string[] | undefined;
  };
  variants?: Record<string, VariantDefinition>; // For deriving routes
  [key: string]: unknown;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  slug: string;
  indexPath: string;
  variantCount: number;
  resourceCount: number;
}

/**
 * Dynamically discovers all wireframe projects by reading metadata.json files
 * from src/wireframes/*\/metadata.json
 */
export function discoverWireframeProjects(): ProjectMetadata[] {
  try {
    const projectContext = import.meta.glob<ProjectMetadata>(
      "/src/wireframes/*/metadata.json",
      { eager: true, import: "default" }
    );

    const projects = Object.entries(projectContext)
      .map(([path, metadata]) => {
        try {
          // Validate required fields
          if (!metadata.id || !metadata.slug || !metadata.routes) {
            console.error(`Invalid metadata at ${path}: missing required fields (id, slug, or routes)`);
            return null;
          }

          // Ensure routes.index exists
          if (!metadata.routes.index) {
            console.error(`Invalid metadata at ${path}: missing routes.index`);
            return null;
          }

          return metadata;
        } catch (error) {
          console.error(`Error processing metadata at ${path}:`, error);
          return null;
        }
      })
      .filter((project): project is ProjectMetadata => project !== null);

    if (projects.length === 0) {
      console.warn("No valid wireframe projects found in src/wireframes/*/metadata.json");
    }

    return projects;
  } catch (error) {
    console.error("Error discovering wireframe projects:", error);
    return [];
  }
}

// Pre-load all page components using Vite's glob import
const pageModules = import.meta.glob<{ default: ComponentType }>(
  "/src/wireframes/*/pages/**/*.tsx",
  { eager: false }
);

/**
 * Generates route configurations from project metadata
 * Returns an array of route objects ready for React Router
 */
export function generateRoutesFromMetadata(
  metadata: ProjectMetadata
): WireframeRoute[] {
  const routes: WireframeRoute[] = [];
  const projectSlug = metadata.slug;

  try {
    // Helper function to find and load a page component
    const loadPageComponent = (pagePath: string): ComponentType => {
      const fullPath = `/src/wireframes/${projectSlug}/pages/${pagePath}`;

      if (pageModules[fullPath]) {
        return lazy(() => pageModules[fullPath]() as Promise<{ default: ComponentType }>);
      }

      // Log available paths for debugging
      console.error(`Page not found: ${fullPath}`);
      console.error('Available pages:', Object.keys(pageModules).filter(p => p.includes(projectSlug)));

      // Return error component
      return lazy(() => Promise.resolve({
        default: () => React.createElement('div', null, `Error: Page not found at ${fullPath}`)
      }));
    };

    // Index route
    const IndexPage = loadPageComponent('Index.tsx');
    routes.push({
      path: metadata.routes.index,
      component: IndexPage,
      exact: true,
    });

    // Variant routes (use derived paths if available)
    const fullRoutes = getFullRoutes(metadata as never) as {
      index: string;
      variants: string[];
      resources: string[];
    };
    const variantPaths = fullRoutes.variants;
    const variantConfig = (metadata.variants && typeof metadata.variants === "object" && !Array.isArray(metadata.variants))
      ? metadata.variants as Record<string, VariantDefinition>
      : {};

    if (variantPaths && variantPaths.length > 0) {
      variantPaths.forEach((variantPath) => {
        try {
          // Extract just the last segment from path
          // e.g., "/mining-tech-survey/option-a" -> "option-a"
          const pathSegments = variantPath.split('/').filter(Boolean);
          const variantSlug = pathSegments[pathSegments.length - 1];

          // Convert to PascalCase for component name (e.g., "option-a" -> "OptionA")
          const variantEntry = variantConfig[variantSlug] || {};
          const referencedComponent = typeof variantEntry.component === "string"
            ? variantEntry.component.trim()
            : null;

          const componentName = referencedComponent && referencedComponent.length > 0
            ? referencedComponent
            : variantSlug
              .split("-")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join("");

          const pagePath = componentName.endsWith(".tsx")
            ? componentName
            : `${componentName}.tsx`;

          const VariantPage = loadPageComponent(pagePath);

          routes.push({
            path: variantPath,
            component: VariantPage,
            exact: true,
          });
        } catch (error) {
          console.error(`Error creating variant route for ${variantPath}:`, error);
        }
      });
    }

    // Resource routes
    if (metadata.routes.resources && Array.isArray(metadata.routes.resources)) {
      metadata.routes.resources.forEach((resourcePath) => {
        try {
          // Handle nested resource routes (e.g., "/resources/article-name")
          const pathParts = resourcePath.split('/').filter(Boolean);
          const lastSegment = pathParts[pathParts.length - 1];

          // Check if this is a top-level resource or nested
          const isTopLevel = lastSegment === 'resources';

          if (isTopLevel) {
            // Top-level resource page (e.g., "/resources")
            const ResourcePage = loadPageComponent('Resources.tsx');
            routes.push({
              path: resourcePath,
              component: ResourcePage,
              exact: true,
            });
          } else {
            // Nested resource page (e.g., "/resources/article-name")
            const componentName = lastSegment
              .split("-")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join("");

            const NestedResourcePage = loadPageComponent(`resources/${componentName}.tsx`);

            routes.push({
              path: resourcePath,
              component: NestedResourcePage,
              exact: true,
            });
          }
        } catch (error) {
          console.error(`Error creating resource route for ${resourcePath}:`, error);
        }
      });
    }
  } catch (error) {
    console.error(`Error generating routes for project ${projectSlug}:`, error);
  }

  return routes;
}

/**
 * Generates all routes for all discovered wireframe projects
 */
export function generateAllWireframeRoutes(): WireframeRoute[] {
  try {
    const projects = discoverWireframeProjects();
    const allRoutes: WireframeRoute[] = [];

    if (projects.length === 0) {
      console.warn("No wireframe projects found. No routes generated.");
      return allRoutes;
    }

    projects.forEach((project) => {
      try {
        const projectRoutes = generateRoutesFromMetadata(project);
        allRoutes.push(...projectRoutes);
        console.log(`✓ Loaded ${projectRoutes.length} route(s) for ${project.slug}`);
      } catch (error) {
        console.error(`Failed to generate routes for ${project.slug}:`, error);
      }
    });

    console.log(`Total wireframe routes loaded: ${allRoutes.length}`);
    return allRoutes;
  } catch (error) {
    console.error("Critical error generating wireframe routes:", error);
    return [];
  }
}

/**
 * Gets summaries of all wireframe projects for navigation/discovery
 */
export function getAllProjectSummaries(): ProjectSummary[] {
  try {
    const projects = discoverWireframeProjects();

    // Sort projects: move dora-data-fusion-models to the end
    const sortedProjects = projects.sort((a, b) => {
      if (a.slug === "dora-data-fusion-models") return 1;
      if (b.slug === "dora-data-fusion-models") return -1;
      return 0;
    });

    return sortedProjects.map((project) => {
      // Count variants from the variants object (schema v2.0)
      const variantKeys = project.variants && typeof project.variants === "object" && !Array.isArray(project.variants)
        ? Object.keys(project.variants)
        : [];
      const totalVariants = variantKeys.length > 0 ? variantKeys.length : 1;

      // Add [WIP] prefix to dora-data-fusion-models title
      const title = project.slug === "dora-data-fusion-models"
        ? `[WIP] ${project.title}`
        : project.title;

      return {
        id: project.id,
        title,
        description: project.description || "No description available",
        slug: project.slug,
        indexPath: project.routes.index,
        variantCount: totalVariants,
        resourceCount: project.routes.resources?.length || 0,
      };
    });
  } catch (error) {
    console.error("Error getting project summaries:", error);
    return [];
  }
}

/**
 * Validates that no two projects have conflicting routes
 */
export function validateRouteUniqueness(): { valid: boolean; conflicts: string[] } {
  try {
    const projects = discoverWireframeProjects();
    const routeMap = new Map<string, string>();
    const conflicts: string[] = [];

    projects.forEach((project) => {
      const allProjectRoutes = [
        project.routes.index,
        ...(project.routes.variants || []),
        ...(project.routes.resources || []),
      ];

      allProjectRoutes.forEach((route) => {
        if (routeMap.has(route)) {
          conflicts.push(`Route "${route}" is claimed by both "${routeMap.get(route)}" and "${project.slug}"`);
        } else {
          routeMap.set(route, project.slug);
        }
      });
    });

    return { valid: conflicts.length === 0, conflicts };
  } catch (error) {
    console.error("Error validating route uniqueness:", error);
    return { valid: false, conflicts: ["Validation failed due to error"] };
  }
}
