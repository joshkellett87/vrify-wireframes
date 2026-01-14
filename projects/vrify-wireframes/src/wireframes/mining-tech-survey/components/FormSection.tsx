import { useState } from "react";
import { Button } from "@wireframe/core";
import { Input } from "@wireframe/core";
import { Label } from "@wireframe/core";
import { Checkbox } from "@wireframe/core";

type FormState = "default" | "error" | "submitting" | "success";

export const FormSection = () => {
  const [formState, setFormState] = useState<FormState>("default");
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    role: "",
    consent: false
  });
  const [showRoleField, setShowRoleField] = useState(false);

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

  return (
    <section id="get-report" className="wireframe-section">
      <div className="wireframe-container">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold baseline-rhythm mb-8 text-center">Get the Full Report</h2>
          
          {formState === "success" ? (
            <div className="text-center space-y-6 bg-background border border-border rounded-lg p-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">✓</div>
              <h3 className="text-xl font-semibold baseline-rhythm">Thank you!</h3>
              <p className="text-muted-foreground baseline-rhythm">
                Check your email for the report. You can also download it directly:
              </p>
              <Button
                onClick={handleDownload}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-6"
              >
                Download PDF
              </Button>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-lg p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={formState === "error" && !formData.email ? "border-red-500" : ""}
                    placeholder="your.email@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company *
                  </Label>
                  <Input
                    id="company"
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
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role (optional)
                    </Label>
                    <Input
                      id="role"
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

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, consent: checked as boolean })
                    }
                    className={`mt-1 ${formState === "error" && !formData.consent ? "border-red-500" : ""}`}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="consent" className="text-sm baseline-rhythm-sm cursor-pointer">
                      I agree to receive the report and marketing communications *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Privacy policy.
                    </p>
                  </div>
                </div>

                {formState === "error" && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                    Please fill in all required fields and accept the terms.
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    {formState === "submitting" ? "Sending..." : "Get the full report (PDF)"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We’ll email the PDF instantly and drop a download link on this page.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
