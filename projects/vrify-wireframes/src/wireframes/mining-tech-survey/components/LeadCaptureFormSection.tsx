import { useState } from "react";
import { Button } from "@wireframe/core";
import { Input } from "@wireframe/core";
import { Label } from "@wireframe/core";
import { Checkbox } from "@wireframe/core";

type FormState = "default" | "error" | "submitting" | "success";

export const LeadCaptureFormSection = () => {
  const [formState, setFormState] = useState<FormState>("default");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    consent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.consent) {
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
    <section id="get-report" className="wireframe-section bg-muted/30">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div className="max-w-3xl mx-auto">
              {formState === "success" ? (
                <div className="bg-background border border-border rounded-lg p-12 shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-6">
                    ✓
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Thank you!</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Check your email for the full report. We've sent it to{" "}
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </p>
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
                  >
                    Download PDF Now
                  </Button>
                </div>
              ) : (
                <div className="bg-background border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3">Get the Full Report</h2>
                    <p className="text-lg text-muted-foreground">
                      Enter your details below for instant access to the complete survey findings
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className={formState === "error" && !formData.firstName ? "border-red-500" : ""}
                          placeholder="John"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className={formState === "error" && !formData.lastName ? "border-red-500" : ""}
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
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
                        placeholder="you@company.com"
                      />
                    </div>

                    <div className="space-y-1">
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

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, consent: checked as boolean })
                        }
                        className={`mt-1 ${formState === "error" && !formData.consent ? "border-red-500" : ""}`}
                      />
                      <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                        I agree to receive the report and marketing communications. You can unsubscribe at any time. *
                      </Label>
                    </div>

                    {formState === "error" && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                        Please fill in all required fields and accept the terms.
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      {formState === "submitting" ? "Processing..." : "Get the Report"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
