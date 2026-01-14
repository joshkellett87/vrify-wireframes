import { cn } from "@/shared/lib/utils";
import { getDesignToken } from "../../designTokens";
import { WireframeButton } from "../wireframe/WireframeButton";

interface FoundationBandProps {
  title?: string;
  description?: string;
  features?: string[];
  capabilities?: string[];
  className?: string;
  showCta?: boolean;
  ctaText?: string;
}

/**
 * FoundationBand - Prominent foundation section for VRIFY Data Uploader
 * Shows Data Uploader as the prerequisite/foundation for other products
 * Text-heavy layout without visual placeholder
 */
export const FoundationBand = ({
  title = "VRIFY Data Uploader",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Foundational to VRIFY's platform, the Data Uploader enables importing diverse data types into a single workspace.",
  features,
  capabilities,
  className,
  showCta = true,
  ctaText = "Learn More"
}: FoundationBandProps) => {
  const borderRadius = getDesignToken("radius.card", "16px");

  const defaultFeatures = [
    "Import diverse data types and formats",
    "Clean and standardize data automatically",
    "Unify data for use across VRIFY Predict and VRIFY Present"
  ];

  const defaultCapabilities = [
    "Supports: CSV, LAS, XLS, shapefiles, and more",
    "Auto-validates data integrity on import",
    "Batch import up to 10GB per session",
    "Real-time data preview and validation",
    "Schema mapping and field normalization",
    "Version history and audit trails"
  ];

  const displayFeatures = features || defaultFeatures;
  const displayCapabilities = capabilities || defaultCapabilities;

  return (
    <section id="data-uploader" className={cn("py-6", className)}>
      <div className="container mx-auto px-4">
        <div
          className="bg-gradient-to-r from-[#F5F5F5] to-[#FAFAFA] border border-[#E0E0E0] p-5 md:p-6"
          style={{ borderRadius }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column - Main Content */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Foundational Tool
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-mono">{title}</h2>
              </div>

              <p className="text-wireframe-text font-mono text-sm leading-relaxed">
                {description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold font-mono text-wireframe-text uppercase tracking-wide">
                  Core Features
                </h4>
                <ul className="space-y-1.5">
                  {displayFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary font-mono text-sm mt-0.5">•</span>
                      <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {showCta && (
                <div className="pt-2">
                  <WireframeButton variant="secondary">
                    {ctaText}
                  </WireframeButton>
                </div>
              )}
            </div>

            {/* Right Column - Technical Capabilities */}
            <div className="space-y-2 lg:pt-[76px]">
              <h4 className="text-sm font-semibold font-mono text-wireframe-text uppercase tracking-wide">
                Technical Capabilities
              </h4>
              <ul className="space-y-1.5">
                {displayCapabilities.map((capability, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-mono text-sm mt-0.5">•</span>
                    <span className="text-wireframe-text font-mono text-sm leading-relaxed">
                      {capability}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
