import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface HeaderShellProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
  bordered?: boolean;
}

/**
 * HeaderShell - Reusable header container with sticky positioning and responsive layout
 *
 * @param children - Header content (logo, navigation, actions)
 * @param className - Additional CSS classes
 * @param sticky - Enable sticky positioning (default: true)
 * @param bordered - Show bottom border (default: true)
 */
export const HeaderShell = ({
  children,
  className,
  sticky = true,
  bordered = true
}: HeaderShellProps) => {
  return (
    <header
      className={cn(
        "wireframe-section py-4",
        sticky && "sticky top-0 z-40 bg-background/95 backdrop-blur",
        bordered && "border-b",
        !bordered && "border-b-0",
        className
      )}
    >
      <div className="wireframe-container">
        <div className="flex items-center justify-between">
          {children}
        </div>
      </div>
    </header>
  );
};
