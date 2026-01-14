import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: ReactNode;
  rating?: number;
  className?: string;
}

/**
 * TestimonialCard - Social proof component for customer testimonials
 *
 * Common use cases:
 * - Customer testimonials
 * - Case study quotes
 * - Review highlights
 * - Social proof sections
 *
 * @param quote - Testimonial text
 * @param author - Person's name
 * @param role - Job title/role
 * @param company - Company name
 * @param avatar - Optional avatar element
 * @param rating - Optional star rating (1-5)
 */
export const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  avatar,
  rating,
  className,
}: TestimonialCardProps) => {
  return (
    <Card className={cn("wireframe-card", className)}>
      <CardContent className="p-6">
        {rating && (
          <div className="flex gap-1 mb-4" aria-label={`Rating: ${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "text-lg",
                  i < rating ? "text-wireframe-700" : "text-wireframe-300"
                )}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        )}

        <blockquote className="text-base leading-relaxed mb-4">
          <p className="before:content-['“'] after:content-['”'] text-foreground">
            {quote}
          </p>
        </blockquote>

        <div className="flex items-center gap-3">
          {avatar && <div className="flex-shrink-0">{avatar}</div>}
          <div>
            <p className="font-semibold text-sm">{author}</p>
            {(role || company) && (
              <p className="text-xs text-muted-foreground">
                {role}
                {role && company && " • "}
                {company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
