import { cn } from "@/shared/lib/utils";

interface InlineProductProps {
  name: string;
  description: string;
  features?: string[];
}

interface InlineProductSectionProps {
  products: InlineProductProps[];
  className?: string;
}

/**
 * InlineProductSection - Displays sub-products as inline sections within a parent product
 * Used for DORA, Cousteau, Data Augmentation within VRIFY Predict
 */
export const InlineProductSection = ({
  products,
  className
}: InlineProductSectionProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-base font-semibold font-mono text-wireframe-text uppercase tracking-wide">
        Products in this Suite
      </h4>
      <div className="space-y-6">
        {products.map((product, index) => (
          <div
            key={index}
            className={cn(
              "pb-6",
              index < products.length - 1 && "border-b border-wireframe-divider"
            )}
          >
            <div className="space-y-2">
              <h5 className="text-lg font-bold font-mono">{product.name}</h5>
              <p className="text-wireframe-text font-mono text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                    <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
