import { cn } from "@/shared/lib/utils";
import { getDesignToken } from "../../designTokens";

interface GroupedFeatures {
  title: string;
  items: string[];
}

interface NestedProductCardProps {
  name: string;
  description: string;
  features?: string[];
  groupedFeatures?: GroupedFeatures[];
  className?: string;
}

/**
 * NestedProductCard - Smaller card for sub-products within a suite
 * Used for DORA, Cousteau, Data Augmentation within VRIFY Predict
 * Supports both simple features list and two-column grouped features
 */
export const NestedProductCard = ({
  name,
  description,
  features,
  groupedFeatures,
  className
}: NestedProductCardProps) => {
  const borderRadius = getDesignToken("radius.card", "12px");

  return (
    <div
      className={cn(
        "bg-white border border-[#E0E0E0] p-4 space-y-2",
        className
      )}
      style={{ borderRadius }}
    >
      <div className="space-y-1.5">
        <h4 className="text-lg font-bold font-mono">{name}</h4>
        <p className="text-wireframe-text font-mono text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Two-column grouped features layout */}
      {groupedFeatures && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {groupedFeatures.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1.5">
              <h5 className="font-semibold font-mono text-xs text-wireframe-text uppercase tracking-wide">
                {group.title}
              </h5>
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                    <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Simple features list (backwards compatible) */}
      {features && !groupedFeatures && features.length > 0 && (
        <ul className="space-y-1 pt-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
              <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface NestedProductCardsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

/**
 * Grid container for nested product cards
 */
export const NestedProductCardsGrid = ({
  children,
  columns = 3
}: NestedProductCardsGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {children}
    </div>
  );
};
