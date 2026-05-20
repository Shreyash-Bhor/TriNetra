import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { TechnologySection } from "@/components/technology-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <TechnologySection />
      </main>
      <Footer />
    </div>
  );
}
