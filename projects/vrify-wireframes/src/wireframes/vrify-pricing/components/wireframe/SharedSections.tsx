import { WireframeButton } from "./WireframeButton";
import { WireframeBox } from "./WireframeBox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";

export const HeroSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="hero-heading">Hero headline</h1>
          <p className="body-text text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <WireframeButton variant="primary">Primary CTA</WireframeButton>
            <WireframeButton variant="secondary">Secondary CTA</WireframeButton>
          </div>
        </div>
        <div className="lg:max-w-[45%]">
          <WireframeBox placeholder="[Hero Image]" height="h-64" className="aspect-[3/2]" />
        </div>
      </div>
    </div>
  </section>
);

export const ProductOverviewStrip = () => (
  <section className="py-8 bg-accent">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="w-8 h-8 bg-wireframe-placeholder mx-auto"></div>
            <span className="caption-text text-wireframe-text">Logo</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const SocialProofSection = () => (
  <section className="py-8">
    <div className="container mx-auto px-4">
      <div className="border border-border rounded-lg py-6 px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 max-w-full mx-auto">
          {Array.from({ length: 6 }, (_, i) => (
            <WireframeBox key={i} className="h-16" placeholder="[Logo]" />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const FAQSection = () => {
  const faqGroups = [
    { title: "General Questions", count: 3 },
    { title: "Support", count: 3 }
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="h2-heading text-center mb-8">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="h3-heading mb-4">{group.title}</h3>
              <Accordion type="single" collapsible className="space-y-3">
                {Array.from({ length: group.count }, (_, i) => (
                  <AccordionItem key={i} value={`item-${groupIndex}-${i}`} className="border border-border bg-secondary rounded-lg">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                      <span className="caption-text text-left">Lorem ipsum question {groupIndex * 3 + i + 1}?</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <span className="caption-text text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FinalCTASection = () => (
  <section className="py-12 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 text-center">
      <h2 className="h2-heading mb-4">Final call to action</h2>
      <WireframeButton variant="secondary">Primary CTA</WireframeButton>
    </div>
  </section>
);
