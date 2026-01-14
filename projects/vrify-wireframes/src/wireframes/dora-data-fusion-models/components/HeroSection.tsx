import React from "react";

const partnerLogos = [
  "RUA Gold",
  "Lion Copper and Gold",
  "Murchison Minerals",
  "Southern Cross Gold",
  "Canterra Minerals"
];

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#0c130a] text-white"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-32 md:grid-cols-2 md:items-center">
        <div className="space-y-8">
          <h1 id="hero-heading" className="text-5xl font-semibold leading-tight md:text-6xl">
            Find the unfound.
          </h1>
          <p className="text-base leading-relaxed text-white/70 md:text-lg">
            DORA, the world's only AI-Assisted Mineral Discovery Platform, puts the power of AI into the hands of
            geoscientists, unlocking opportunities within your data. Built for a new era of exploration, DORA supports
            technical teams in making faster, more confident decisions that accelerate discovery so you can drill smart
            and find things.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              className="rounded-full bg-[#f97316] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-[#fb923c]"
              href="/ai-demo"
            >
              Book a demo
            </a>
          </div>
        </div>
        <div className="relative">
          <div
            className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#091007]"
            aria-hidden="true"
          >
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/20 text-xs uppercase tracking-[0.35em] text-white/40">
              Platform visual placeholder
            </div>
          </div>
        </div>
      </div>
      <div
        id="trust"
        className="border-t border-white/5 bg-[#0a0f07] px-6 py-12"
        aria-label="Trusted by exploration leaders"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-white/60 md:justify-start md:gap-12">
            {partnerLogos.map((logo) => (
              <span key={logo} className="whitespace-nowrap">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
