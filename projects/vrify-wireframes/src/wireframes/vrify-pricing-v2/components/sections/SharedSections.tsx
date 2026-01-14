import { WireframeButton } from "../wireframe/WireframeButton";
import { WireframeBox } from "../wireframe/WireframeBox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";

/**
 * LogoRow - Social proof section with client/partner logos
 */
export const LogoRow = () => (
  <section id="social-proof" className="py-8">
    <div className="container mx-auto px-4">
      <h4 className="text-center text-base font-semibold font-mono text-muted-foreground mb-8">
        Trusted by leaders in exploration
      </h4>
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

/**
 * HowItWorks - Process steps section
 */
export const HowItWorks = () => (
  <section id="how-it-works" className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 font-mono">Getting started with VRIFY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { number: "1", title: "Book a Demo", desc: "Lorem ipsum dolor sit amet consectetur" },
          { number: "2", title: "Solution Design", desc: "Sed do eiusmod tempor incididunt" },
          { number: "3", title: "Onboarding", desc: "Ut labore et dolore magna aliqua" },
          { number: "4", title: "Launch", desc: "Quis nostrud exercitation ullamco" },
        ].map((step, index) => (
          <div key={index} className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-mono font-bold">
              {step.number}
            </div>
            <WireframeBox placeholder="[Step Image]" height="h-32" className="mx-auto max-w-[200px]" />
            <div>
              <h3 className="text-lg font-semibold mb-2 font-mono">{step.title}</h3>
              <p className="text-muted-foreground text-sm font-mono leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/**
 * FAQ - Frequently asked questions accordion
 */
export const FAQ = () => {
  const faqItems = [
    { question: "Lorem ipsum dolor sit amet?", answer: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { question: "Ut enim ad minim veniam?", answer: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { question: "Duis aute irure dolor?", answer: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { question: "Excepteur sint occaecat?", answer: "Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { question: "Sed ut perspiciatis unde?", answer: "Omnis iste natus error sit voluptatem accusantium doloremque laudantium." },
    { question: "Nemo enim ipsam voluptatem?", answer: "Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores." },
  ];

  return (
    <section id="faq" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-mono">Frequently asked questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border bg-secondary rounded-lg"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <span className="font-mono text-sm text-left">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.answer}
                  </span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

/**
 * Testimonial - Customer quote section
 */
export const Testimonial = () => (
  <section id="testimonial" className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <blockquote className="text-xl md:text-2xl font-mono leading-relaxed text-wireframe-text italic">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
        </blockquote>
        <div className="flex items-center justify-center space-x-4">
          <WireframeBox placeholder="[Photo]" height="h-16" className="w-16 rounded-full" />
          <div className="text-left">
            <p className="font-mono font-semibold">Lorem Ipsum</p>
            <p className="font-mono text-sm text-muted-foreground">CEO, Dolor Sit Amet Inc.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * FinalCTA - Bottom conversion section with large branding
 */
export const FinalCTA = () => (
  <section id="cta" className="py-16 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-mono">
            Experience the future of exploration
          </h2>
          <p className="text-lg font-mono opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <WireframeButton variant="secondary">
          Start Your Discovery
        </WireframeButton>

        {/* Large VRIFY branding */}
        <div className="pt-8">
          <div className="text-[80px] md:text-[120px] lg:text-[160px] font-bold font-mono tracking-tighter opacity-20 leading-none">
            VRIFY
          </div>
        </div>
      </div>
    </div>
  </section>
);
