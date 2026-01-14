import { Suspense, lazy } from "react";
import {
  Toaster,
  Toaster as Sonner,
  TooltipProvider,
  generateAllWireframeRoutes,
  validateRouteUniqueness,
  ErrorBoundary,
} from "@wireframe/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-4">Page not found</p>
      <a href="/" className="text-primary hover:underline">
        Return to home
      </a>
    </div>
  </div>
);

// Lazy load the home page
const Home = lazy(() => import("./pages/Home"));

// Validate route uniqueness on startup
const routeValidation = validateRouteUniqueness();
if (!routeValidation.valid) {
  console.error("⚠️  Route conflicts detected:");
  routeValidation.conflicts.forEach((conflict) => console.error(`  - ${conflict}`));
}

// Generate routes dynamically from all project metadata files
const wireframeRoutes = generateAllWireframeRoutes();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              {/* Home/Platform index page */}
              <Route path="/" element={<Home />} />

              {/* Dynamically generated routes from metadata.json files */}
              {wireframeRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}

              {/* Catch-all 404 route - always keep this last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
