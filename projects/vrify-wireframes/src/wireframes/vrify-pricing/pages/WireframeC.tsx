import { PricingHero } from "../components/pricing/PricingHero";
import { PricingCard } from "../components/pricing/PricingCard";
import { SocialProofSection, FAQSection, FinalCTASection } from "../components/wireframe/SharedSections";
import { WireframeHeader } from "@/shared/components/WireframeHeader";

const HowItWorksA = () => (
  <section className="py-8 px-6 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 font-mono">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { number: "1", title: "Book a Demo", desc: "Reach out for initial consultation" },
          { number: "2", title: "Solution Design", desc: "Custom configuration and proposal" },
          { number: "3", title: "Onboarding & Integration", desc: "Implementation, setup, and user training" },
          { number: "4", title: "Launch & Support", desc: "Go live with dedicated success management" },
        ].map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-mono font-bold">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold mb-2 font-mono">{step.title}</h3>
            <p className="text-muted-foreground text-sm font-mono leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PricingC = () => {
  const doraData = {
    productName: "DORA",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    groupedInclusions: [
      {
        title: "Lorem Ipsum Features",
        items: [
          "Lorem ipsum dolor sit amet",
          "Consectetur adipiscing elit",
          "Sed do eiusmod tempor",
          "Incididunt ut labore"
        ]
      },
      {
        title: "Dolor Magna Aliqua",
        items: [
          "Ut enim ad minim veniam",
          "Quis nostrud exercitation",
          "Ullamco laboris nisi",
          "Ut aliquip ex ea commodo"
        ]
      }
    ],
    specifications: [
      { label: "Lorem Ipsum", value: "Dolor sit amet" },
      { label: "Consectetur", value: "Adipiscing elit" },
      { label: "Sed Eiusmod", value: "Tempor incididunt" },
      { label: "Ut Labore", value: "Dolore magna aliqua" },
      { label: "Enim Minim", value: "Veniam quis nostrud" }
    ],
    notes: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ]
  };

  const vizData = {
    productName: "Viz",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    groupedInclusions: [
      {
        title: "Consectetur Adipiscing",
        items: [
          "Duis aute irure dolor",
          "In reprehenderit voluptate",
          "Velit esse cillum dolore",
          "Eu fugiat nulla pariatur"
        ]
      },
      {
        title: "Excepteur Sint",
        items: [
          "Cupidatat non proident",
          "Sunt in culpa qui",
          "Officia deserunt mollit",
          "Anim id est laborum"
        ]
      }
    ],
    specifications: [
      { label: "Sed Perspiciatis", value: "Unde omnis iste" },
      { label: "Natus Error", value: "Sit voluptatem" },
      { label: "Accusantium", value: "Doloremque laudantium" },
      { label: "Totam Rem", value: "Aperiam eaque ipsa" },
      { label: "Quae Illo", value: "Inventore veritatis" }
    ],
    notes: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
    ]
  };

  const dataUploaderData = {
    productName: "Data Uploader",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    groupedInclusions: [
      {
        title: "Lorem Ipsum Dolor",
        items: [
          "Sed ut perspiciatis unde",
          "Omnis iste natus error",
          "Sit voluptatem accusantium"
        ]
      },
      {
        title: "Totam Rem Aperiam",
        items: [
          "Eaque ipsa quae ab",
          "Illo inventore veritatis",
          "Et quasi architecto"
        ]
      },
      {
        title: "Nemo Enim Ipsam",
        items: [
          "Voluptatem quia voluptas",
          "Sit aspernatur aut odit",
          "Aut fugit sed quia"
        ]
      },
      {
        title: "Neque Porro Quisquam",
        items: [
          "Est qui dolorem ipsum",
          "Quia dolor sit amet",
          "Consectetur adipisci velit"
        ]
      }
    ],
    specifications: [
      { label: "Eius Modi Tempora", value: "Incidunt ut labore" },
      { label: "Et Dolore Magnam", value: "Aliquam quaerat" },
      { label: "Voluptatem Ut", value: "Enim ad minima" },
      { label: "Veniam Quis", value: "Nostrud exercitation" }
    ],
    notes: [
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti."
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <WireframeHeader
        basePath="/vrify-pricing"
        projectTitle="Pricing Wireframes"
        navItems={[
          { to: "/vrify-pricing/professional-cards", label: "Wireframe A", end: false },
          { to: "/vrify-pricing/unified-panel", label: "Wireframe B", end: false },
          { to: "/vrify-pricing/cards-foundation", label: "Wireframe C", end: false },
          { to: "/vrify-pricing/components-preview", label: "Components", end: false }
        ]}
      />

      {/* Hero Section */}
      <PricingHero />

      {/* Main Pricing Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PricingCard
              {...doraData}
              variant="professional"
            />
            <PricingCard
              {...vizData}
              variant="professional"
            />
          </div>

          {/* Data Uploader Foundation */}
          <div className="w-full">
            <PricingCard
              {...dataUploaderData}
              variant="compact"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProofSection />

      {/* How It Works */}
      <HowItWorksA />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection />
    </div>
  );
};

export default PricingC;
