import React from "react";

type Step = {
  step: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    step: "[ 1 ]",
    title: "Data Ingestion & Compilation",
    description:
      "VRIFY unifies your project data with DORA's proprietary database to build a powerful, AI-ready data stack for faster, smarter discovery. Whether you have a little data or a lot, there are valuable insights waiting to be uncovered."
  },
  {
    step: "[ 2 ]",
    title: "Augment & Extend Existing Data",
    description:
      "DORA's AI extends and enhances your data, generating new insights with the support of our geoscience team who helps run early models to maximize value. Our proprietary Feature Processing Modules allow you to see beyond what you know."
  },
  {
    step: "[ 3 ]",
    title: "Prediction Review & Refinement",
    description:
      "Refine AI-generated targets using project knowledge and iterate with guidance from VRIFY's experts. Adjust parameters, investigate feature importance, and rerun models to continually improve accuracy."
  },
  {
    step: "[ 4 ]",
    title: "Target Definition & Exploration Planning",
    description:
      "Use predictions to prioritize targets and refine your exploration strategy to reduce risk and improve outcomes."
  },
  {
    step: "[ 5 ]",
    title: "Iteration & Optimization",
    description:
      "Add new data, retrain models, and enhance predictions. We are continuously improving DORA with Feature Processing Modules and enhanced data to support ongoing exploration."
  },
  {
    step: "[ 6 ]",
    title: "Visualize & Communicate",
    description:
      "Present your models and results in 3D with VRIFY's Viz, showcasing discoveries to stakeholders and investors to clearly communicate value beyond the known."
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-[#0f1b11] py-32 text-white">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">
          How it works
        </h2>
        <div className="mt-20 grid gap-20 md:gap-24">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:items-center md:gap-12"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div
                  className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/20 text-xs uppercase tracking-[0.35em] text-white/40"
                  aria-hidden="true"
                >
                  {index === 0 && "Data ingestion visual"}
                  {index === 1 && "AI augmentation visual"}
                  {index === 2 && "Prediction review visual"}
                  {index === 3 && "Target planning visual"}
                  {index === 4 && "Iteration visual"}
                  {index === 5 && "3D visualization visual"}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
                  {item.step}
                </p>
                <h3 className="text-3xl font-semibold text-white">{item.title}</h3>
                <p className="text-base leading-relaxed text-white/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
