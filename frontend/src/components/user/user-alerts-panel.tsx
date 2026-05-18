import { AlertTriangle, BellRing, Radio } from "lucide-react";
import { SiteAlert } from "@/types/alert";
import { Badge } from "@/components/ui/badge";

type UserAlertsPanelProps = {
  alerts: SiteAlert[];
};

export function UserAlertsPanel({ alerts }: UserAlertsPanelProps) {
  return (
    <section className="rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-indigo-400/25 dark:from-slate-900/60 dark:via-indigo-950/25 dark:to-cyan-950/20">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Live Emergency Alerts</h2>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Radio className="mr-1 h-3.5 w-3.5" />
          Real-time
        </Badge>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-indigo-200/70 bg-white/70 p-5 text-sm text-muted-foreground transition-colors duration-300 dark:border-indigo-300/20 dark:bg-white/5">
          No active alerts. You are all clear right now.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert._id}
              className="group rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-orange-50/80 to-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-rose-400/30 dark:from-rose-900/30 dark:via-orange-950/20 dark:to-slate-900/40"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold tracking-tight">{alert.title}</p>
                <Badge variant="destructive" className="rounded-full">
                  <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Live
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground/90">
                {alert.message}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground/90">
                <p>Created by: {alert.createdByRole}</p>
                Broadcast at {new Date(alert.createdAt).toLocaleString()}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
