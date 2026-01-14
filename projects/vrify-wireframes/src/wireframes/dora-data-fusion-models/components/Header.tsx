import React, { useState } from "react";

const platformLinks = [
  { label: "Overview", href: "/platform" },
  { label: "DORA", href: "/dora-platform" },
  { label: "Viz", href: "/viz" }
];

const solutionsLinks = [
  {
    title: "By Company Type",
    items: [
      { label: "Mineral Exploration", href: "#" },
      { label: "Mining", href: "#" },
      { label: "Investors", href: "#" }
    ]
  },
  {
    title: "By Role",
    items: [
      { label: "CEO", href: "#" },
      { label: "Geologist", href: "#" },
      { label: "IT", href: "#" }
    ]
  }
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Leadership Team", href: "/leadership-team" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" }
];

const rightActions = [
  { label: "Login", href: "https://vrify.com/admin" },
  { label: "Join Meeting", href: "https://vrify.com/meetings" }
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090f06]/95 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a href="/dora-data-fusion-models" className="flex items-center gap-3" aria-label="VRIFY home">
          <img
            src="https://vrify.com/wp-content/uploads/2024/10/vrify-logo-white.svg"
            alt="VRIFY"
            className="h-6 w-auto"
            loading="lazy"
          />
          <span className="sr-only">VRIFY</span>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm text-white md:flex">
          <a
            href="/"
            className="font-medium transition hover:text-[#f97316]"
          >
            ← Wireframes
          </a>
          <div className="group relative inline-flex">
            <button className="flex items-center gap-2 font-medium transition hover:text-[#f97316]">
              Platform
              <span aria-hidden className="text-xs">▾</span>
            </button>
            <div className="absolute left-0 top-full hidden min-w-[240px] translate-y-2 rounded-lg border border-white/10 bg-[#101b10] p-6 shadow-xl group-hover:block">
              <ul className="space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      className="block text-left text-sm font-medium text-white transition hover:text-[#f97316]"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a
            href="/resources"
            className="font-medium transition hover:text-[#f97316]"
          >
            Resources
          </a>
          <div className="group relative inline-flex">
            <button className="flex items-center gap-2 font-medium transition hover:text-[#f97316]">
              Solutions
              <span aria-hidden className="text-xs">▾</span>
            </button>
            <div className="absolute left-1/2 top-full hidden w-[320px] -translate-x-1/2 translate-y-2 rounded-lg border border-white/10 bg-[#101b10] p-6 shadow-xl group-hover:grid group-hover:grid-cols-2 group-hover:gap-6">
              {solutionsLinks.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                    {group.title}
                  </p>
                  <ul className="space-y-2">
                    {group.items.map((link) => (
                      <li key={link.label}>
                        <a
                          className="block text-sm font-medium text-white transition hover:text-[#f97316]"
                          href={link.href}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="group relative inline-flex">
            <button className="flex items-center gap-2 font-medium transition hover:text-[#f97316]">
              Company
              <span aria-hidden className="text-xs">▾</span>
            </button>
            <div className="absolute left-0 top-full hidden min-w-[240px] translate-y-2 rounded-lg border border-white/10 bg-[#101b10] p-6 shadow-xl group-hover:block">
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      className="block text-left text-sm font-medium text-white transition hover:text-[#f97316]"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {rightActions.map((action) => (
            <a
              key={action.label}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-[#f97316] hover:text-[#f97316]"
              href={action.href}
            >
              {action.label}
            </a>
          ))}
          <a
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#fb923c]"
            href="/ai-demo"
          >
            Book a demo
          </a>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {menuOpen ? (
        <div id="mobile-nav" className="border-t border-white/10 bg-[#0c150a] px-6 py-4 md:hidden">
          <div className="space-y-4 text-sm text-white">
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/60">Platform</p>
              <ul className="mt-2 space-y-2">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <a className="block" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/60">Solutions</p>
              <ul className="mt-2 space-y-2">
                {solutionsLinks.flatMap((group) => group.items).map((link) => (
                  <li key={link.label}>
                    <a className="block" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/60">Company</p>
              <ul className="mt-2 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a className="block" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              {rightActions.map((action) => (
                <a
                  key={action.label}
                  className="rounded-full border border-white/20 px-4 py-2 text-center text-sm font-medium text-white"
                  href={action.href}
                >
                  {action.label}
                </a>
              ))}
              <a
                className="rounded-full bg-[#f97316] px-4 py-3 text-center text-sm font-semibold text-black"
                href="/ai-demo"
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
