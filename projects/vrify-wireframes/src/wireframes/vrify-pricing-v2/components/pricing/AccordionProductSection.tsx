import { cn } from "@/shared/lib/utils";
import { getDesignToken } from "../../designTokens";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";

interface GroupedFeatures {
  title: string;
  items: string[];
}

interface AccordionProduct {
  name: string;
  description: string;
  features?: string[];
  groupedFeatures?: GroupedFeatures[];
}

interface AccordionProductSectionProps {
  products: AccordionProduct[];
  className?: string;
}

/**
 * AccordionProductSection - Collapsible product modules for dense layouts
 * Single-expand behavior (one item open at a time)
 * Supports both simple features list and two-column grouped features
 */
export const AccordionProductSection = ({
  products,
  className
}: AccordionProductSectionProps) => {
  const borderRadius = getDesignToken("radius.card", "12px");

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-semibold font-mono text-wireframe-text uppercase tracking-wide mb-3">
        Included Modules
      </h4>
      <Accordion type="single" collapsible className="space-y-2">
        {products.map((product, index) => (
          <AccordionItem
            key={index}
            value={`product-${index}`}
            className="border border-[#E0E0E0] bg-white overflow-hidden"
            style={{ borderRadius }}
          >
            <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-gray-50">
              <div className="flex flex-col items-start text-left gap-0.5">
                <span className="font-mono font-bold text-base">{product.name}</span>
                <span className="font-mono text-xs text-muted-foreground leading-snug">
                  {product.description}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-0">
              {/* Two-column grouped features layout */}
              {product.groupedFeatures && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.groupedFeatures.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-1.5">
                      <h5 className="font-semibold font-mono text-xs text-wireframe-text uppercase tracking-wide">
                        {group.title}
                      </h5>
                      <ul className="space-y-1">
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <span className="text-wireframe-text font-mono text-xs mt-0.5">•</span>
                            <span className="text-wireframe-text font-mono text-xs leading-relaxed">
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
              {product.features && !product.groupedFeatures && (
                <ul className="space-y-1">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <span className="text-wireframe-text font-mono text-xs mt-0.5">•</span>
                      <span className="text-wireframe-text font-mono text-xs leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
