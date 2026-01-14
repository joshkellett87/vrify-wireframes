import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface Step {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface ProcessStepProps {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * ProcessStep - Sequential step indicator for processes and workflows
 *
 * Common use cases:
 * - How it works sections
 * - Onboarding flows
 * - Multi-step processes
 * - Methodology explanations
 *
 * @param steps - Array of step objects (title, description, optional icon)
 * @param orientation - Layout direction (default: horizontal on desktop, vertical on mobile)
 * @param className - Additional CSS classes
 */
export const ProcessStep = ({
  steps,
  orientation = "horizontal",
  className,
}: ProcessStepProps) => {
  return (
    <div
      className={cn(
        "flex gap-8",
        orientation === "horizontal"
          ? "flex-col md:flex-row md:items-start"
          : "flex-col",
        className
      )}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 relative",
            orientation === "horizontal" && index < steps.length - 1 && "md:after:content-[''] md:after:absolute md:after:top-12 md:after:-right-4 md:after:w-8 md:after:h-px md:after:bg-border"
          )}
        >
          <div className="flex gap-4">
            {/* Step number circle */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 pt-1">
              {step.icon && (
                <div className="mb-2 text-muted-foreground">{step.icon}</div>
              )}
              <h3 className="font-semibold text-base mb-2 baseline-rhythm">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
