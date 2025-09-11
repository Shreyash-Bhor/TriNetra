import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Brain } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero content */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">AI-Powered Safety</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Trinetra: AI Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Crowd Management
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Revolutionary AI technology that transforms crowd management and public safety. Real-time analytics,
            predictive insights, and automated responses for safer events and venues.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="glass-strong hover:bg-primary/90 transition-all duration-300 group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="glass border-border/50 hover:bg-card/80 bg-transparent">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">Real-time</div>
              <div className="text-sm text-muted-foreground">AI Processing</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
