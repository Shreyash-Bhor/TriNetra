import Link from "next/link";
import {
  ArrowRight,
  Bell,
  LayoutDashboard,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modules = [
  {
    name: "Admin Command Center",
    description:
      "Monitor all camera feeds, review crowd density, manage lost-person reports, and publish site-wide alerts.",
    href: "/admin",
    icon: LayoutDashboard,
    audience: "Admin",
  },
  {
    name: "Volunteer Response Desk",
    description:
      "File lost-person reports, send emergency alerts to admins, and track active alerts during incidents.",
    href: "/volunteer",
    icon: ShieldAlert,
    audience: "Volunteer",
  },
  {
    name: "Public Safety View",
    description:
      "Get live safety alerts, crowd density awareness, weather updates, and practical on-ground safety guidance.",
    href: "/user",
    icon: UserRound,
    audience: "Volunteer / Admin",
  },
  {
    name: "Authentication",
    description:
      "Secure login and signup flow to access role-specific features and dashboards.",
    href: "/login",
    icon: Bell,
    audience: "All Users",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-8">
        <section className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-xl backdrop-blur md:p-12">
          <Badge className="mb-4" variant="secondary">
            TriNetra Platform
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            AI-assisted crowd safety coordination
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground sm:text-lg">
            TriNetra helps teams coordinate public safety through real-time
            crowd monitoring, lost-person workflows, and emergency alerts. Use
            the modules below to access role-based operations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Go to Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent"
            >
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Website modules
            </h2>
            <p className="mt-2 text-muted-foreground">
              Quick overview of the pages available in this system and what each
              one is used for.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((module) => (
              <Card key={module.name} className="rounded-2xl border-border/60">
                <CardHeader className="pb-3">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <module.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">{module.audience}</Badge>
                    <Button asChild variant="ghost" className="px-2">
                      <Link href={module.href}>
                        Open module <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
