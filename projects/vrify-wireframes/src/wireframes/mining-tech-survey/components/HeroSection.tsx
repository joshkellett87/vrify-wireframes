import { Button } from "@wireframe/core";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  variant?: "default" | "form-preview" | "form-inline" | "sticky-sidebar";
}

const PREVIEW_HIGHLIGHTS = [
  "Adoption benchmarks by mine type",
  "Top investment priorities for 2025",
  "Operational KPIs leaders track",
];

export const HeroSection = ({ variant = "default" }: HeroSectionProps) => {
  const heroCtaLabel = "Download the report (PDF)";

  const scrollToForm = () => {
    if (variant === "sticky-sidebar") {
      // Scroll to where sidebar appears and focus on email field
      window.scrollTo({ top: 700, behavior: "smooth" });
      setTimeout(() => {
        document.getElementById("sidebar-email")?.focus();
      }, 500);
      return;
    }

    // For all other variants, scroll to the main lead capture form section
    const formSection = document.getElementById("get-report");
    if (!formSection) return;

    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      document.getElementById("firstName")?.focus();
    }, 500);
  };

  return (
    <section id="hero" className="wireframe-section">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div
              className={
                variant === "form-preview"
                  ? "grid gap-10 lg:grid-cols-12"
                  : variant === "form-inline"
                  ? "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
                  : variant === "sticky-sidebar"
                  ? "max-w-4xl"
                  : ""
              }
            >
              <div
                className={
                  variant === "form-preview"
                    ? "lg:col-span-8 flex flex-col lg:pr-8"
                    : "flex flex-col"
                }
              >
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold baseline-rhythm">
                    Mining Tech Survey Report
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 max-w-xl lg:mt-8 mb-8 lg:mb-10">
                  <Button
                    onClick={scrollToForm}
                    aria-label="Download the report (PDF)"
                    className="self-start bg-primary text-primary-foreground hover:bg-primary-hover px-6 max-w-xs"
                  >
                    {heroCtaLabel}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    We'll email the PDF. No spam. Takes &lt;1 minute.
                  </p>
                  <Link
                    to="/mining-tech-survey/resources"
                    className="text-sm font-medium text-primary hover:text-primary-hover underline underline-offset-4 w-fit"
                    aria-label="View all resources related to the Mining Tech Survey"
                  >
                    View all resources
                  </Link>
                </div>

                {variant === "form-preview" && (
                  <div className="mt-6 lg:hidden">
                    <PreviewCard />
                  </div>
                )}
              </div>

              {variant === "form-preview" && (
                <div className="lg:col-span-4 hidden lg:block lg:self-start">
                  <PreviewCard />
                </div>
              )}

              {variant === "form-inline" && (
                <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold baseline-rhythm">Instant preview + download</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete the quick form now—your preview unlocks immediately and the full PDF arrives by email.
                      </p>
                    </div>
                    <form className="grid grid-cols-1 gap-3" onSubmit={scrollToForm}>
                      <label className="space-y-1.5 text-sm font-medium">
                        Work Email
                        <input
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          placeholder="you@company.com"
                          type="email"
                          required
                        />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium">
                        Company
                        <input
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          placeholder="Company name"
                          type="text"
                          required
                        />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium">
                        Role (optional)
                        <input
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          placeholder="Director of Ops"
                          type="text"
                        />
                      </label>
                      <button
                        type="submit"
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                      >
                        Continue to complete the form
                      </button>
                    </form>
                    <p className="text-xs text-muted-foreground text-center">
                      Need the full details? Head to the form below to finish and download instantly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PreviewCard = () => {
  return (
    <div className="rounded-lg border border-border bg-card px-6 pt-2 pb-6 shadow-sm">
      <div className="mb-2 flex aspect-[4/3] items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
        Report cover preview
      </div>
      <h3 className="mt-2 text-lg font-semibold text-foreground">What you’ll get</h3>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {PREVIEW_HIGHLIGHTS.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden="true"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
