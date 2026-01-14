import { WireframeHeader as SharedWireframeHeader } from "@/shared/components/WireframeHeader";

export const WireframeHeader = ({ basePath = "/mining-tech-survey" }: { basePath?: string }) => {
  const variantNavItems = [
    { to: `${basePath}/option-a`, label: "Option A", end: false },
    { to: `${basePath}/option-b`, label: "Option B", end: false },
    { to: `${basePath}/option-c`, label: "Option C", end: false },
  ];

  return (
    <SharedWireframeHeader
      basePath={basePath}
      projectTitle="All Variants"
      navItems={variantNavItems}
    />
  );
};
