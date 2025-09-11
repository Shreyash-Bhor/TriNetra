import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Mail } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-strong border-border/50 max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Ready to Transform Your Safety Operations?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Join leading venues and event organizers who trust Trinetra to keep their crowds safe. Get started with a
              personalized demo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="glass-strong hover:bg-primary/90 transition-all duration-300 group">
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="glass border-border/50 hover:bg-card/80 bg-transparent">
                <Mail className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
