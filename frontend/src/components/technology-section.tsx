import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const technologies = [
  { name: "Next.js", category: "Frontend" },
  { name: "CNN", category: "AI/ML" },
  { name: "Computer Vision", category: "AI/ML" },
  { name: "Real-time Analytics", category: "Data" },
];

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Built with cutting-edge technologies to ensure reliability,
            scalability, and performance at enterprise scale.
          </p>
        </div>

        <Card className="glass-strong border-border/50 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="text-center">
                  <Badge
                    variant="secondary"
                    className="glass mb-2 hover:bg-primary/20 transition-colors"
                  >
                    {tech.category}
                  </Badge>
                  <div className="font-semibold">{tech.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
