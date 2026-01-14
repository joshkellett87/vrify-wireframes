import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";

type FormState = "default" | "error" | "submitting" | "success";

export const StickyFormSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState<FormState>("default");
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    role: "",
    consent: false
  });
  const [showRoleField, setShowRoleField] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar after scrolling past ~600px (hero + some content)
      const scrollThreshold = 600;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.company || !formData.consent) {
      setFormState("error");
      return;
    }

    setFormState("submitting");

    // Simulate API call
    setTimeout(() => {
      setFormState("success");
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate PDF download
    console.log("Analytics: pdf_download");
  };

  if (!isVisible) return null;

  return (
    <aside className="sticky top-24 h-fit">
      <div className="bg-background border border-border rounded-lg p-6 shadow-lg">
        {formState === "success" ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold">Thank you!</h3>
            <p className="text-sm text-muted-foreground">
              Check your email for the report.
            </p>
            <Button
              onClick={handleDownload}
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Download PDF
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Get the Report</h3>
              <p className="text-sm text-muted-foreground">
                Instant access to the full PDF
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sidebar-email" className="text-sm font-medium">
                  Work Email *
                </Label>
                <Input
                  id="sidebar-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formState === "error" && !formData.email ? "border-red-500" : ""}
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sidebar-company" className="text-sm font-medium">
                  Company *
                </Label>
                <Input
                  id="sidebar-company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={formState === "error" && !formData.company ? "border-red-500" : ""}
                  placeholder="Company Name"
                />
              </div>

              {showRoleField ? (
                <div className="space-y-1.5">
                  <Label htmlFor="sidebar-role" className="text-sm font-medium">
                    Role (optional)
                  </Label>
                  <Input
                    id="sidebar-role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Your Role"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRoleField(true)}
                  className="text-sm text-primary underline underline-offset-2"
                >
                  Add your role (optional)
                </button>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="sidebar-consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consent: checked as boolean })
                  }
                  className={`mt-1 ${formState === "error" && !formData.consent ? "border-red-500" : ""}`}
                />
                <Label htmlFor="sidebar-consent" className="text-xs leading-tight cursor-pointer">
                  I agree to receive the report and marketing communications *
                </Label>
              </div>

              {formState === "error" && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  Please fill in all required fields.
                </div>
              )}

              <Button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {formState === "submitting" ? "Sending..." : "Get the Report"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Instant email delivery + download link
              </p>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};
