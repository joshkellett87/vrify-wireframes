const faqs = [
  {
    question: "How quickly will I receive the report?",
    answer:
      "We send the PDF immediately after form submission and include a direct download link on this page for instant access."
  },
  {
    question: "Can I share the findings with my team?",
    answer:
      "Yes—feel free to forward the download link or drop the highlights into internal presentations. All insights are licensed for internal enablement."
  },
  {
    question: "What methodology details are included?",
    answer:
      "The appendix covers sample composition, survey instrument, validation checks, and interview protocol. See the methodology section above for a quick overview."
  }
];

export const FAQSection = () => {
  return (
    <section id="faq" className="wireframe-section">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <h2 className="text-2xl font-semibold baseline-rhythm mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-border bg-background/60 p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground">
                    {faq.question}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
