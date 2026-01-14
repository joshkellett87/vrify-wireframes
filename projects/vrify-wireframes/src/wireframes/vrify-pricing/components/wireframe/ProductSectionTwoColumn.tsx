import { WireframeButton } from "./WireframeButton";

interface ProductSectionTwoColumnProps {
  productName: string;
  className?: string;
}

export const ProductSectionTwoColumn = ({ productName, className }: ProductSectionTwoColumnProps) => {
  // Flatten all inclusions into a single list for two-column display
  const allInclusions = [
    { label: "Lorem ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
    { label: "Dolor sit amet", description: "Sed do eiusmod tempor incididunt ut labore et dolore" },
    { label: "Consectetur", description: "Ut enim ad minim veniam, quis nostrud exercitation" },
    { label: "Adipiscing elit", description: "Ullamco laboris nisi ut aliquip ex ea commodo" },
    { label: "Tempor incididunt", description: "Duis aute irure dolor in reprehenderit in voluptate" },
    { label: "Magna aliqua", description: "Velit esse cillum dolore eu fugiat nulla pariatur" },
    { label: "Minim veniam", description: "Excepteur sint occaecat cupidatat non proident" },
    { label: "Quis nostrud", description: "Sunt in culpa qui officia deserunt mollit anim" },
    { label: "Exercitation", description: "Laborum sed ut perspiciatis unde omnis iste natus" },
    { label: "Voluptatem", description: "Accusantium doloremque laudantium totam rem aperiam" },
    { label: "Eaque ipsa", description: "Quae ab illo inventore veritatis et quasi architecto" }
  ];

  const specRows = Array.from({ length: 10 }, (_, i) => ({
    label: `Specification ${i + 1}`,
    value: `Value ${i + 1}`
  }));

  return (
    <div className={className}>
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Product Header */}
          <div>
            <h2 className="h2-heading mb-4">{productName} Product</h2>
            <p className="body-text text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Two-Column Inclusions Section */}
          <div>
            <h3 className="h3-heading mb-6">Inclusions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {allInclusions.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-wireframe-placeholder mt-2 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="caption-text font-medium text-foreground">{item.label}</div>
                    <div className="caption-text text-wireframe-text mt-1 leading-relaxed">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spec Table */}
          <div>
            <h3 className="h3-heading mb-4">Specifications</h3>
            <div className="border border-border">
              {specRows.map((row, index) => (
                <div key={index} className={`flex border-b border-border ${index % 3 === 2 ? 'border-b-2' : ''}`}>
                  <div className="flex-1 p-3 bg-wireframe-box border-r border-border">
                    <span className="caption-text text-wireframe-text">{row.label}</span>
                  </div>
                  <div className="flex-1 p-3">
                    <span className="caption-text">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="h3-heading mb-4">Notes</h3>
            <div className="space-y-2">
              <p className="caption-text text-wireframe-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="caption-text text-wireframe-text">Sed do eiusmod tempor incididunt ut labore et dolore.</p>
              <p className="caption-text text-wireframe-text">Ut enim ad minim veniam, quis nostrud exercitation.</p>
              <p className="caption-text text-wireframe-text">Duis aute irure dolor in reprehenderit in voluptate.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <WireframeButton variant="primary">
              CTA - {productName}
            </WireframeButton>
          </div>
        </div>
      </div>
    </div>
  );
};
