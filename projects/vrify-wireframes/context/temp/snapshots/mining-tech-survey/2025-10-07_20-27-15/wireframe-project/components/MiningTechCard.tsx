import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";

interface WireframeCardProps {
  title: string;
  description: string;
  href: string;
  emphasis: string;
  when: string;
}

const sectionOrder = ["Hero", "Overview", "Findings", "Methodology", "Form", "Resources"];

export const WireframeCard = ({ title, description, href, emphasis, when }: WireframeCardProps) => {
  return (
    <div className="wireframe-card">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold baseline-rhythm">{title}</h3>
        <p className="text-sm text-muted-foreground baseline-rhythm-sm">{description}</p>
        <p className="text-xs text-muted-foreground italic">When to use: {when}</p>
        <p className="text-xs text-annotation">{emphasis}</p>
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
          {sectionOrder.map((section, index) => (
            <span key={section} className="flex items-center gap-1">
              <span className="rounded border border-border bg-background px-2 py-0.5">{section}</span>
              {index < sectionOrder.length - 1 && <span className="text-border">→</span>}
            </span>
          ))}
        </div>
        <Link to={href}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover min-h-[44px]">
            View {title}
          </Button>
        </Link>
      </div>
    </div>
  );
};
