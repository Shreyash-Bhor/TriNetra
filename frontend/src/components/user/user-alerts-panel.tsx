import { BellRing } from "lucide-react";
import { SiteAlert } from "@/types/alert";
import { Badge } from "@/components/ui/badge";

type UserAlertsPanelProps = {
  alerts: SiteAlert[];
};

export function UserAlertsPanel({ alerts }: UserAlertsPanelProps) {
  return (
    <section className="rounded-3xl border border-white/30 bg-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center gap-2">
        <BellRing className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Emergency Alerts</h2>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/40 bg-white/25 p-4 text-sm text-muted-foreground transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
          No active alerts. You are all clear right now.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert._id}
              className="rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50/85 via-amber-50/70 to-white/90
 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-rose-400/30 
 dark:from-rose-950/20 dark:via-black/20 dark:to-black/30"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{alert.title}</p>
                <Badge variant="destructive">Live</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {alert.message}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/90">
                Broadcast at {new Date(alert.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
