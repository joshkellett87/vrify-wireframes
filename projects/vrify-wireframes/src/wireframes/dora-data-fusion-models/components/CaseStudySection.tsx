import React from "react";

export const CaseStudySection = () => {
  return (
    <section id="case-study" className="bg-white py-32 text-[#0b1207]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[minmax(0,480px)_1fr] md:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">Case studies</p>
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            We help make mineral discovery your unfair business advantage.
          </h2>
          <div className="mt-8 rounded-2xl border-2 border-[#d0d7cb] bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">Case study</p>
            <h3 className="mt-4 text-2xl font-semibold leading-snug text-[#0b1207]">
              Cartier Resources Unlocks New Potential In A Historic Gold Mining Region
            </h3>
            <p className="mt-4 text-base leading-relaxed text-[#1c2815]/80">
              Uncovering new targets in a historic gold camp with AI: Cartier's plan for smarter exploration.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#f97316] transition hover:text-[#fb923c]"
              href="/resources/case-study-cartier-resources"
            >
              Read full story
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#d0d7cb] bg-[#f5f7f1]">
            <div
              className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#d0d7cb] text-xs uppercase tracking-[0.35em] text-[#a1ad99]"
              aria-hidden="true"
            >
              Aerial landscape visual
            </div>
          </div>
      </div>
    </section>
  );
};
