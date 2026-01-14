import { WireframeButton } from "../wireframe/WireframeButton";

interface ProductData {
  name: string;
  description: string;
  inclusions: string[];
}

interface UnifiedPricingPanelProps {
  products: [ProductData, ProductData];
  className?: string;
}

export const UnifiedPricingPanel = ({ products, className }: UnifiedPricingPanelProps) => {
  const [leftProduct, rightProduct] = products;

  return (
    <div className={`bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl ${className}`}>
      <div className="grid grid-cols-2 divide-x divide-[#EAEAEA]">
        {/* Left Product */}
        <div className="p-5 space-y-3">
          <h3 className="text-3xl font-bold font-mono">{leftProduct.name}</h3>

          <p className="text-wireframe-text font-mono text-sm leading-relaxed">
            {leftProduct.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold font-mono">Inclusions</h4>
            <ul className="space-y-1">
              {leftProduct.inclusions.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                  <span
                    className="text-wireframe-text font-mono text-sm"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <WireframeButton variant="primary">
              Book a Demo
            </WireframeButton>
          </div>
        </div>

        {/* Right Product */}
        <div className="p-5 space-y-3">
          <h3 className="text-3xl font-bold font-mono">{rightProduct.name}</h3>

          <p className="text-wireframe-text font-mono text-sm leading-relaxed">
            {rightProduct.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold font-mono">Inclusions</h4>
            <ul className="space-y-1">
              {rightProduct.inclusions.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-wireframe-text font-mono text-sm mt-0.5">•</span>
                  <span
                    className="text-wireframe-text font-mono text-sm"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <WireframeButton variant="primary">
              Book a Demo
            </WireframeButton>
          </div>
        </div>
      </div>
    </div>
  );
};
