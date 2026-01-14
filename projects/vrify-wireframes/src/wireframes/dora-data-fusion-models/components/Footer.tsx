import React from "react";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Platform Overview", href: "/platform" },
      { label: "DORA", href: "/dora-platform" },
      { label: "Viz", href: "/viz" },
      { label: "Login", href: "https://admin.vrify.com/" },
      { label: "Help Centre", href: "https://help.vrify.com/en/" }
    ]
  },
  {
    title: "Resources",
    links: [{ label: "Resource Hub", href: "/resources" }]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Follow Us",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/vrify/" },
      { label: "X / Twitter", href: "https://twitter.com/VRIFYTechnology" },
      { label: "YouTube", href: "https://www.youtube.com/c/VRIFYTechnology" }
    ]
  }
];

const legalLinks = [
  { label: "App Store", href: "https://itunes.apple.com/app/vrify/id1235301790?mt=8" },
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Legal Compliance", href: "/legal" }
];

const otherWireframes = [
  {
    label: "Mining Tech Survey",
    description: "Multi-variant report experience exploring exploration tech adoption insights.",
    href: "/mining-tech-survey"
  }
];

export const Footer = () => {
  return (
    <footer className="bg-[#0c130a] text-white" aria-label="Global footer">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-12 rounded-2xl border border-white/10 bg-[#10190e] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            Other wireframes
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {otherWireframes.map((item) => (
              <a
                key={item.label}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0d150b] p-4 text-left transition hover:border-[#f97316] hover:text-[#f97316]"
                href={item.href}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-white/60">{item.description}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-12 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/60">
                {column.title}
              </p>
              <ul className="space-y-3 text-sm font-medium">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="transition hover:text-[#f97316]" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <a key={link.label} className="transition hover:text-[#f97316]" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="text-xs uppercase tracking-wider">
            © 2025 VRIFY • 49° 16' 57.828'' N 123° 7' 14.646'' W
          </div>
        </div>
      </div>
    </footer>
  );
};
