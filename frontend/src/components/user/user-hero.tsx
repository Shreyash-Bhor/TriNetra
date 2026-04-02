import { Activity, MapPin, ShieldCheck } from "lucide-react";

const statCards = [
  {
    title: "Safety Status",
    value: "Stable",
    icon: ShieldCheck,
  },
  {
    title: "Coverage",
    value: "24/7 Active",
    icon: Activity,
  },
  {
    title: "Region",
    value: "Smart City Zone",
    icon: MapPin,
  },
];

export function UserHero() {
  return (
    <section className="rounded-3xl border border-white/30 bg-white/40 p-6 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          User Dashboard
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Stay Informed, Stay Prepared.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Real-time alerts, live crowd density, and weather insights in one
          glass-inspired experience.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/30 bg-white/35 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/55 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Icon className="h-4 w-4" /> {title}
            </p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
