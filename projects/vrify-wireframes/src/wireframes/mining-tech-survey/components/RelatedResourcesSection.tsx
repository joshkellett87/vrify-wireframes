import { Link } from "react-router-dom";

export const RelatedResourcesSection = () => {
  const resources = [
    {
      title: "Mining Innovation Trends 2024",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      href: "resources/mining-innovation-trends-2024"
    },
    {
      title: "Technology Adoption Benchmarks",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
      href: "resources/technology-adoption-benchmarks"
    },
    {
      title: "Industry Best Practices Guide",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      href: "resources/industry-best-practices-guide"
    }
  ];

  return (
    <section id="resources" className="wireframe-section border-b-0">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
          <h2 className="text-2xl font-semibold baseline-rhythm mb-8">Related Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold baseline-rhythm mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground baseline-rhythm-sm mb-4">
                  {resource.description}
                </p>
                <Link 
                  to={resource.href}
                  className="text-sm text-primary hover:text-primary-hover underline"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
