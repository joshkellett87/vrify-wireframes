const anchors = [
  { id: "overview", label: "Overview" },
  { id: "findings", label: "Key findings" },
  { id: "methodology", label: "Methodology" },
  { id: "faq", label: "FAQ" },
  { id: "resources", label: "Resources" },
];

export const PageAnchorNav = () => {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="wireframe-section py-6">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div className="flex items-center justify-center">
              <div className="flex w-full max-w-4xl items-center justify-center gap-2 rounded border border-border bg-muted/30 px-4 py-4 text-sm">
                {anchors.map((anchor) => (
                  <button
                    key={anchor.id}
                    type="button"
                    onClick={() => handleScroll(anchor.id)}
                    className="flex-1 min-w-[120px] max-w-[140px] rounded border border-transparent bg-background/80 px-3 py-2 text-center text-muted-foreground transition-all duration-200 ease-vrify hover:border-border hover:text-foreground whitespace-nowrap"
                  >
                    {anchor.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
