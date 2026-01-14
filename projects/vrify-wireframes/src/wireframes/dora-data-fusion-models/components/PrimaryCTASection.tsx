import React from "react";

export const PrimaryCTASection = () => {
  return (
    <section
      id="primary-cta"
      className="relative overflow-hidden bg-[#0a1107] py-32 text-white md:py-40"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.15),_transparent_70%)] opacity-70" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">
          See VRIFY in action
        </p>
        <h2 id="cta-heading" className="text-5xl font-semibold leading-tight md:text-6xl">
          Start discovering.
        </h2>
        <a
          className="mt-4 rounded-full bg-[#f97316] px-10 py-4 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-[#fb923c]"
          href="/ai-demo"
        >
          Book a demo
        </a>
      </div>
      <div className="relative mt-20 flex justify-center">
        <div
          className="flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center"
          aria-hidden="true"
        >
          <span className="text-[clamp(3rem,15vw,10rem)] font-bold uppercase tracking-[0.3em] text-white/8">
            VRIFY
          </span>
        </div>
      </div>
    </section>
  );
};
