"use client";

import { Users, Waves, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveResource } from "@/hooks/use-live-resource";
import { fetchVolunteerDashboardKpis } from "@/lib/volunteerKpiApi";

const abbreviateIndianNumber = (value: number) => {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return value.toString();
};

export function VolunteerKpiCards() {
  const { data } = useLiveResource({
    topic: "volunteers",
    fetcher: fetchVolunteerDashboardKpis,
    pollingMs: 10000,
  });

  const cards = [
    {
      title: "Total Crowd Count",
      value: data ? abbreviateIndianNumber(data.totalCrowdCount) : "--",
      icon: Waves,
      tone: "text-cyan-700 dark:text-cyan-300",
    },
    {
      title: "Registered Volunteers",
      value: data
        ? abbreviateIndianNumber(data.totalRegisteredVolunteers)
        : "--",
      icon: Users,
      tone: "text-violet-700 dark:text-violet-300",
    },
    {
      title: "Highest Density Zone (Till Date)",
      value: data?.highestDensityZone ?? "--",
      icon: MapPin,
      tone: "text-rose-700 dark:text-rose-300",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="glass-strong rounded-3xl border border-slate-300/80 shadow-xl dark:border-white/15"
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            </div>
            <card.icon className={`h-6 w-6 ${card.tone}`} />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
