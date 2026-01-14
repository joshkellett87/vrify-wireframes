import { cn } from "@/shared/lib/utils";
import { getDesignToken } from "../../designTokens";
import { WireframeButton } from "../wireframe/WireframeButton";

interface GroupedInclusion {
  title: string;
  items: string[];
}

interface Specification {
  label: string;
  value: string;
}

interface ProductCardProps {
  productName: string;
  productType?: "suite" | "software" | "foundation";
  showProductType?: boolean; // Whether to show the product type label
  description: string;
  inclusions?: string[];
  groupedInclusions?: GroupedInclusion[];
  specifications?: Specification[];
  notes?: string[];
  children?: React.ReactNode; // For nested cards or inline sections
  variant?: "default" | "stacked" | "compact";
  className?: string;
  ctaText?: string;
}

export const ProductCard = ({
  productName,
  productType,
  showProductType = false,
  description,
  inclusions,
  groupedInclusions,
  specifications,
  notes,
  children,
  variant = "default",
  className,
  ctaText = "Book a Demo"
}: ProductCardProps) => {
  const cardStyles = {
    default: "bg-[#F9F9F9] border border-[#EAEAEA] px-4 py-4",
    stacked: "bg-[#F9F9F9] border border-[#EAEAEA] px-4 py-4",
    compact: "bg-[#F9F9F9] border border-[#EAEAEA] px-3 py-3"
  };

  const borderRadius = getDesignToken("radius.card", "16px");
  const boxShadow = getDesignToken("shadow.card", getDesignToken("shadow.sm", "none"));

  const productTypeLabel = {
    suite: "Product Suite",
    software: "Software",
    foundation: "Foundational Tool"
  };

  return (
    <div className={cn(cardStyles[variant], "h-full flex flex-col", className)} style={{ borderRadius, boxShadow }}>
      <div className={cn("flex-grow", variant === "compact" ? "space-y-2" : "space-y-4")}>
        {/* Header */}
        <div className="space-y-2">
          {showProductType && productType && (
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {productTypeLabel[productType]}
            </span>
          )}
          <h3 className={variant === "compact" ? "text-2xl font-bold font-mono" : "text-3xl font-bold font-mono"}>
            {productName}
          </h3>
        </div>

        <p className="text-wireframe-text font-mono text-sm leading-relaxed">
          {description}
        </p>

        {/* Nested content (sub-products) */}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}

        {/* Inclusions Section */}
        {(inclusions || groupedInclusions) && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold font-mono">Inclusions</h4>

            {/* Simple Inclusions */}
            {inclusions && (
              <ul className="space-y-1.5">
                {inclusions.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                    <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Grouped Inclusions */}
            {groupedInclusions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {groupedInclusions.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-1.5">
                    <h5 className="font-semibold font-mono text-sm text-wireframe-text uppercase tracking-wide">
                      {group.title}
                    </h5>
                    <ul className="space-y-1.5">
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
          </div>
        )}

        {/* Specifications Section */}
        {specifications && (
          <div className="space-y-3">
            <h4 className={variant === "compact" ? "text-base font-semibold font-mono" : "text-lg font-semibold font-mono"}>
              Specifications
            </h4>
            <div className="border border-wireframe-border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-wireframe-bg" : "bg-background"}>
                      <td className="px-4 py-1.5 font-mono text-sm font-semibold text-wireframe-text border-r border-wireframe-border text-start">
                        {spec.label}
                      </td>
                      <td className="px-4 py-1.5 font-mono text-sm text-wireframe-text text-start">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Additional Info Section */}
        {notes && notes.length > 0 && (
          <div className="space-y-2">
            <h4 className={variant === "compact" ? "text-base font-semibold font-mono" : "text-lg font-semibold font-mono"}>
              Additional Info
            </h4>
            <div className="space-y-1.5">
              {notes.map((note, index) => (
                <p key={index} className="text-wireframe-text font-mono text-sm leading-relaxed">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={cn("pt-6", variant === "compact" && "mt-auto")}>
        <WireframeButton variant="primary">
          {ctaText}
        </WireframeButton>
      </div>
    </div>
  );
};
