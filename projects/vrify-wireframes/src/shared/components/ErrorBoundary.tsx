import { Component, ReactNode } from "react";
import { getBaseDesignToken } from "@/shared/design-system";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Intentional inline style usage: demonstrate runtime design token retrieval
      // for radii/shadows without introducing additional Tailwind utilities.
      // If preferred, these can be mapped to Tailwind CSS variables in a follow-up.
      const borderRadius = getBaseDesignToken("radius.lg", "12px");
      const boxShadow = getBaseDesignToken("shadow.sm", "0 4px 12px rgba(15, 23, 42, 0.1)");

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
          <div
            className="max-w-md w-full bg-card border border-border p-6 space-y-4"
            style={{ borderRadius, boxShadow }}
          >
            <h1 className="text-2xl font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              An error occurred while loading this page. Please try refreshing
              the browser.
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error details
                </summary>
                <pre className="mt-2 p-4 bg-muted text-xs overflow-auto" style={{ borderRadius: getBaseDesignToken("radius.sm", "4px") }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 transition-colors"
              style={{ borderRadius: getBaseDesignToken("radius.md", "8px") }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
