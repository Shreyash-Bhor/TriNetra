import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, AlertTriangle, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Crowd Analytics",
    description:
      "Advanced AI algorithms analyze crowd density, generate heatmap visulaization in real-time to provide actionable insights.",
  },
  {
    icon: AlertTriangle,
    title: "AI-Powered Alerts",
    description:
      "Intelligent alert system that predicts potential safety issues and automatically notifies security personnel before incidents occur.",
  },
  {
    icon: Shield,
    title: "Public Safety Dashboard",
    description:
      "Comprehensive dashboard providing security teams with complete situational awareness and control over crowd management operations.",
  },
  {
    icon: Zap,
    title: "Scalable Infrastructure",
    description:
      "Cloud-native architecture that scales seamlessly from small venues to large stadiums, handling millions of data points per second.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Cutting-edge AI technology designed to revolutionize crowd
            management and enhance public safety across all types of venues and
            events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass border-border/50 hover:bg-card/80 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 glass rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-balance">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-pretty">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
