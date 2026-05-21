"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AdminKpiCard,
  glassCardClass,
} from "@/components/admin/admin-dashboard-shared";

type Props = {
  kpis: AdminKpiCard[];
  kpiChanges: Record<string, number>;
};

export function AdminKpiCards({ kpis, kpiChanges }: Props) {
  return (
    <Card className={glassCardClass}>
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl">
          Admin Command Center
        </CardTitle>
        <CardDescription>
          Unified operations for alerts, crowd monitoring, and lost person
          response.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const delta = kpiChanges[kpi.key] ?? 0;
          return (
            <div
              key={kpi.key}
              className="rounded-2xl border border-slate-300/80 bg-white/55 p-4 dark:border-white/15 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <p className={`text-xs uppercase ${kpi.toneClass}`}>
                  {kpi.label}
                </p>
                <Icon className={`h-4 w-4 ${kpi.toneClass}`} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-semibold">{kpi.value}</p>
                {delta > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <TrendingUp className="h-3.5 w-3.5" />+{delta}
                  </span>
                ) : null}
                {delta < 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-700 dark:text-rose-300">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {delta}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
