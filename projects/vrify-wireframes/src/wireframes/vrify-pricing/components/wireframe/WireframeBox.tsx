import { cn } from "@/shared/lib/utils";

interface WireframeBoxProps {
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
  height?: string;
}

export const WireframeBox = ({ children, className, placeholder, height = "h-32" }: WireframeBoxProps) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed border-wireframe-divider bg-wireframe-box flex items-center justify-center",
        height,
        className
      )}
    >
      {children || (
        <span className="text-wireframe-text font-mono text-sm">
          {placeholder || "[Placeholder]"}
        </span>
      )}
    </div>
  );
};
