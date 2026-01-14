import React, { useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Robert Eckford",
    role: "CEO of RUA Gold",
    quote:
      "DORA has enabled our team to make faster, smarter decisions. AI rapidly synthesized our historical data, revealing meaningful geological patterns that would've taken weeks to uncover manually."
  },
  {
    name: "Michael Hudson",
    role: "Managing Director, Southern Cross Gold",
    quote:
      "With industry-recognized expertise at VRIFY AI, I'm confident our collaboration has demonstrated a strong case for AI integration across the mining and exploration sector."
  }
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="bg-[#0a1107] py-32 text-white">
      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">Testimonials</p>
        <div className="mt-16 rounded-2xl border border-white/10 bg-black/30 p-12 md:p-16">
          <p className="text-2xl font-light leading-relaxed text-white md:text-3xl">"{activeTestimonial.quote}"</p>
          <div className="mt-10 space-y-2 text-sm font-semibold uppercase tracking-wider text-white/50">
            <p>{activeTestimonial.name}</p>
            <p>{activeTestimonial.role}</p>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-sm uppercase tracking-wider text-white/40">
            <button
              type="button"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-[#f97316] hover:text-[#f97316]"
              onClick={handlePrev}
            >
              Prev
            </button>
            <span className="text-xs">
              {activeIndex + 1} / {testimonials.length}
            </span>
            <button
              type="button"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-[#f97316] hover:text-[#f97316]"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
