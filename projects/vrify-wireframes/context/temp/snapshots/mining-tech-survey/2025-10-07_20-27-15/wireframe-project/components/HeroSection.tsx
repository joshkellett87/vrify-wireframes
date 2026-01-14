import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  variant?: "default" | "form-preview" | "form-inline" | "sticky-sidebar";
}

export const HeroSection = ({ variant = "default" }: HeroSectionProps) => {
  const scrollToForm = () => {
    document.getElementById("get-report")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="wireframe-section">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div
              className={
                variant === "form-preview"
                  ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
                  : variant === "form-inline"
                  ? "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
                  : variant === "sticky-sidebar"
                  ? "max-w-4xl"
                  : ""
              }
            >
              <div>
                <h1 className="text-4xl font-bold baseline-rhythm mb-4">
                  Mining Tech Survey Report
                </h1>
                <p className="text-lg text-muted-foreground baseline-rhythm mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={scrollToForm}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover px-6"
                  >
                    Get the full report (PDF)
                  </Button>
                  <Link to="/resources">
                    <Button variant="outline" className="px-6">
                      View all Resources
                    </Button>
                  </Link>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Takes under a minute. We'll email the PDF and keep you in the loop—no spam, unsubscribe anytime.
                </p>
              </div>

              {variant === "form-preview" && (
                <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">What you’ll get</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <div>
                        <p className="font-medium text-foreground">Full 30-page PDF with first-party data</p>
                        <p className="text-muted-foreground">Benchmarks, verbatims, and appendix tables.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <div>
                        <p className="font-medium text-foreground">Interactive charts + YOY comparisons</p>
                        <p className="text-muted-foreground">Spot trends by company size and region.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <div>
                        <p className="font-medium text-foreground">Methods + sample details</p>
                        <p className="text-muted-foreground">Who responded, when fieldwork ran, and how data was validated.</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      onClick={scrollToForm}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      Continue to form
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Ready when you are—finish below to get the download link.
                    </p>
                  </div>
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
