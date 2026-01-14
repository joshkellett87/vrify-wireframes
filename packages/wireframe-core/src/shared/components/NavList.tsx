import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface NavListProps {
  children: ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  ariaLabel?: string;
}

/**
 * NavList - Accessible navigation list with proper ARIA attributes
 *
 * @param children - Navigation items (typically NavLink or Link components)
 * @param className - Additional CSS classes
 * @param orientation - Layout direction (default: horizontal)
 * @param ariaLabel - Accessible label for navigation (default: "Primary")
 */
export const NavList = ({
  children,
  className,
  orientation = "horizontal",
  ariaLabel = "Primary",
}: NavListProps) => {
  return (
    <nav
      className={cn(
        "flex items-center",
        orientation === "horizontal" ? "space-x-6" : "flex-col space-y-4",
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </nav>
  );
};
