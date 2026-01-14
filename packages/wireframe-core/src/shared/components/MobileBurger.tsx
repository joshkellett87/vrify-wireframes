import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../lib/utils";

interface MobileBurgerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * MobileBurger - Hamburger menu toggle button for mobile navigation
 *
 * @param isOpen - Whether the mobile menu is currently open
 * @param onToggle - Callback when button is clicked
 * @param className - Additional CSS classes
 * @param ariaLabel - Accessible label for the button
 */
export const MobileBurger = ({
  isOpen,
  onToggle,
  className,
  ariaLabel = "Toggle navigation menu",
}: MobileBurgerProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </Button>
  );
};
