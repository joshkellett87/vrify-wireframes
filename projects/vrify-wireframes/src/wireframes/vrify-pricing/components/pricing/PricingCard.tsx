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

interface PricingCardProps {
  productName: string;
  description: string;
  inclusions?: string[];
  groupedInclusions?: GroupedInclusion[];
  specifications?: Specification[];
  notes?: string[];
  variant?: "professional" | "filled" | "outline" | "detailed" | "compact";
  className?: string;
}

export const PricingCard = ({
  productName,
  description,
  inclusions,
  groupedInclusions,
  specifications,
  notes,
  variant = "professional",
  className
}: PricingCardProps) => {
  const cardStyles = {
    professional: "bg-[#F9F9F9] border border-[#EAEAEA] px-6 py-8",
    filled: "bg-[#F0F5FF] border-2 border-solid border-[#AECBFF] px-6 py-8",
    outline: "bg-white border-2 border-solid border-[#AECBFF] px-6 py-8",
    detailed: "bg-[#FAFAFA] border border-[#E0E0E0] px-6 py-8",
    compact: "bg-[#F9F9F9] border border-[#EAEAEA] px-5 py-6"
  };

  const borderRadius = getDesignToken("radius.card", "16px");
  const boxShadow = getDesignToken("shadow.card", getDesignToken("shadow.sm", "none"));

  return (
    <div className={cn(cardStyles[variant], className)} style={{ borderRadius, boxShadow }}>
      <div className={variant === "compact" ? "space-y-3" : "space-y-4"}>
        <h3 className={variant === "compact" ? "text-2xl font-bold font-mono" : "text-3xl font-bold font-mono"}>{productName}</h3>

        <p className="text-wireframe-text font-mono text-sm leading-relaxed">
          {description}
        </p>

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
                    <span
                      className="text-wireframe-text font-mono text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* Grouped Inclusions */}
            {groupedInclusions && (
              <div className={variant === "detailed" ? "space-y-3" : variant === "compact" ? "grid grid-cols-1 md:grid-cols-4 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {groupedInclusions.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-1.5">
                    <h5 className="font-semibold font-mono text-sm text-wireframe-text uppercase tracking-wide">
                      {group.title}
                    </h5>
                    <ul className="space-y-1.5">
                      {group.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                          <span
                            className="text-wireframe-text font-mono text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
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
            <h4 className={variant === "compact" ? "text-base font-semibold font-mono" : "text-lg font-semibold font-mono"}>Specifications</h4>
            <div className="border border-wireframe-border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-wireframe-bg" : "bg-background"}>
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-wireframe-text border-r border-wireframe-border text-start">
                        {spec.label}
                      </td>
                      <td className="px-5 py-4 font-mono text-sm text-wireframe-text text-start">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes Section */}
        {notes && notes.length > 0 && (
          <div className="space-y-3">
            <h4 className={variant === "compact" ? "text-base font-semibold font-mono" : "text-lg font-semibold font-mono"}>Notes</h4>
            <div className="space-y-2">
              {notes.map((note, index) => (
                <p key={index} className="text-wireframe-text font-mono text-sm leading-relaxed">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <WireframeButton variant="primary">
            Book a Demo
          </WireframeButton>
        </div>
      </div>
    </div>
  );
};
