import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../lib/utils";

interface MetricCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

/**
 * MetricCard - Displays a key metric with optional trend indicator
 *
 * Common use cases:
 * - Dashboard KPIs
 * - Performance metrics
 * - Statistical highlights
 *
 * @param value - Primary metric value (number or formatted string)
 * @param label - Metric label/title
 * @param icon - Optional icon element
 * @param description - Optional supporting text
 * @param trend - Trend direction (up/down/neutral)
 * @param trendValue - Trend percentage/change value
 */
export const MetricCard = ({
  value,
  label,
  icon,
  description,
  trend,
  trendValue,
  className,
}: MetricCardProps) => {
  return (
    <Card className={cn("wireframe-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold baseline-rhythm">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend === "up" && "text-wireframe-700",
                    trend === "down" && "text-wireframe-500",
                    trend === "neutral" && "text-wireframe-600"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trend === "neutral" && "→"} {trendValue}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground ml-4">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
