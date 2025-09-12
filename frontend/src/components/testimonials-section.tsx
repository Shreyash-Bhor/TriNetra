import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Security Director",
    company: "MetroEvents",
    content:
      "Trinetra has transformed how we manage large-scale events. The AI predictions are incredibly accurate and have prevented multiple incidents.",
    avatar: "/professional-woman-diverse.png",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Venue Manager",
    company: "Stadium Solutions",
    content:
      "The real-time analytics dashboard gives us unprecedented visibility into crowd dynamics. It's like having eyes everywhere.",
    avatar: "/professional-man.png",
    rating: 5,
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Safety Consultant",
    company: "Public Safety Institute",
    content:
      "The predictive capabilities of Trinetra are remarkable. It's setting new standards for public safety technology.",
    avatar: "/professional-woman-doctor.png",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Trusted by Professionals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            See what industry leaders are saying about Trinetra's impact on their operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass border-border/50 hover:bg-card/80 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
