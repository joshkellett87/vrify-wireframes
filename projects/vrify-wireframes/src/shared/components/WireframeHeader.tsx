import { NavLink, Link } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface WireframeHeaderProps {
  basePath: string;
  projectTitle?: string;
  navItems?: NavItem[];
}

export const WireframeHeader = ({
  basePath,
  projectTitle,
  navItems = []
}: WireframeHeaderProps) => {
  // Default nav items: Home + project index
  const defaultNavItems: NavItem[] = [
    { to: "/", label: "← Home", end: true },
    { to: basePath, label: projectTitle || "All Variants", end: true },
    ...navItems
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm baseline-rhythm-sm transition-colors px-2 py-1",
      isActive ? "text-primary underline underline-offset-4" : "text-foreground hover:text-primary",
    ].join(" ");

  return (
    <header className="wireframe-section border-b-0 py-4">
      <div className="wireframe-container">
        <div className="flex items-center justify-between">
          <Link to={basePath} className="text-xl font-bold baseline-rhythm" aria-label={`Go to ${projectTitle || 'project index'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="129" height="26" viewBox="0 0 129 26" fill="none" className="h-4 w-auto">
              <path fillRule="evenodd" clipRule="evenodd" d="M28.0281 11.3697H17.1067L23.5786 0.15625H19.7809L14.2528 9.72928L8.72472 0.15625H4.94944L11.4213 11.3697H0.5V14.6506H11.4213L4.94944 25.8641H8.72472L14.2528 16.2911L19.7809 25.8641H23.5562L17.0843 14.6506H28.0056V11.3697H28.0281ZM16.927 14.5607L14.2528 16.0888L11.5787 14.5607V11.4821L14.2528 9.954L16.927 11.4821V14.5607Z" fill="currentColor"></path>
              <path d="M50.0728 0.157303L44.2301 22.9213H42.2525L36.4098 0.157303H33.0391L39.7132 25.8652H46.7694L53.4436 0.157303H50.0728ZM70.4548 16.5618L72.9267 14.1124V3.10112L69.9829 0.157303H55.2863V25.8652H58.5896V17.0562H67.2188L71.3761 25.8652H74.9492L70.4773 16.5618H70.4548ZM69.6009 14.1124H58.5896V3.10112H69.6009V14.1124ZM88.4548 2.94382V0L82.2076 0.292135L75.9604 0V2.94382L80.5447 3.1236V22.8764L75.9604 23.0562V26L82.2076 25.7079L88.4548 26V23.0562L83.8705 22.8764V3.1236L88.4548 2.94382ZM106.882 3.10112V0.157303H90.6121V25.8652H93.9155V17.0562H106.14V14.1124H93.9155V3.07865H106.882V3.10112Z" fill="currentColor"></path>
              <path d="M124.995 0.156494L121.41 14.1115H114.914L111.332 0.156494H107.961L111.399 13.37L112.356 17.0554H116.523V25.8644H119.826V17.0554H123.992L124.95 13.37L128.388 0.156494H124.995Z" fill="currentColor"></path>
            </svg>
          </Link>

          <nav className="hidden md:flex items-center space-x-6" aria-label="Primary">
            {defaultNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
