import React from "react";

type Benefit = {
  number: string;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    number: "01",
    title: "Geoscience-Driven AI, Built by Experts",
    description:
      "Developed by geoscientists and AI leaders, DORA interprets exploration data into actionable insights. Our team guides you through data prep, model refinement, and platform training to support your next discovery."
  },
  {
    number: "02",
    title: "Strategic Mineral Exploration",
    description:
      "DORA pinpoints high-potential targets quickly, using mineral-system-specific models to reduce risk and accelerate decisions, turning months of work into days."
  },
  {
    number: "03",
    title: "Smarter Models, Stronger Data",
    description:
      "With every new dataset, DORA's AI improves. Built on one of the industry's richest databases, it delivers sharper predictions and faster, more accurate planning."
  },
  {
    number: "04",
    title: "Intuitive, Geoscience-Friendly Interface",
    description:
      "DORA's user-friendly platform empowers geoscientists to explore, refine, and iterate with speed and precision. Blending AI with deep expertise leads to game-changing exploration outcomes."
  }
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="bg-white py-32 text-[#0b1207]">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">Benefits</p>
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            AI in mineral exploration doesn't have to be a black box.
          </h2>
          <p className="text-base leading-relaxed text-[#1c2815]/80 md:text-lg">
            DORA's purpose-built AI brings clarity and confidence to your exploration strategy, driving smarter targeting
            and faster results.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="flex flex-col gap-4 rounded-2xl border-2 border-[#d0d7cb] bg-white p-8 shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                {benefit.number}
              </span>
              <h3 className="text-2xl font-semibold text-[#0b1207]">{benefit.title}</h3>
              <p className="text-base leading-relaxed text-[#1c2815]/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
