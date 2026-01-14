import { cn } from "@/shared/lib/utils";
import { getDesignToken } from "../../designTokens";

interface WireframeButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const WireframeButton = ({ children, variant = "primary", className }: WireframeButtonProps) => {
  const isFullWidth = className?.includes('w-full');
  const borderRadius = getDesignToken("radius.button", "9999px");

  return (
    <div
      className={cn(
        isFullWidth ? "block" : "inline-block",
        "px-6 py-2.5 border border-solid rounded button-text text-center cursor-pointer transition-colors font-medium",
        variant === "primary"
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:border-primary/90"
          : "border-primary bg-background text-primary hover:bg-accent",
        className
      )}
      style={{ borderRadius }}
    >
      {children}
    </div>
  );
};
