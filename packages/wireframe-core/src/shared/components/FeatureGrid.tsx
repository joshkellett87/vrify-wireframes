import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../lib/utils";

interface Feature {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * FeatureGrid - Responsive grid layout for product features/capabilities
 *
 * Common use cases:
 * - Product feature showcases
 * - Capability highlights
 * - Service offerings
 * - Benefits sections
 *
 * @param features - Array of feature objects (title, description, optional icon)
 * @param columns - Number of columns in desktop view (default: 3)
 * @param className - Additional CSS classes
 */
export const FeatureGrid = ({
  features,
  columns = 3,
  className,
}: FeatureGridProps) => {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        gridCols[columns],
        className
      )}
    >
      {features.map((feature, index) => (
        <Card key={index} className="wireframe-card">
          <CardHeader>
            {feature.icon && (
              <div className="mb-4 text-muted-foreground">{feature.icon}</div>
            )}
            <CardTitle className="text-lg baseline-rhythm">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
