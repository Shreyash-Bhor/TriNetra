import { AlertTriangle, BellRing, Radio, Siren } from "lucide-react";
import { SiteAlert } from "@/types/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type VolunteerLiveAlertsProps = {
  alerts: SiteAlert[];
  canDismiss?: boolean;
  onDismiss?: (id: string) => void;
};

export function VolunteerLiveAlerts({
  alerts,
  canDismiss = false,
  onDismiss,
}: VolunteerLiveAlertsProps) {
  const pinnedAlerts = alerts.slice(0, 2);
  const overflowAlerts = alerts.slice(2);

  return (
    <section className="rounded-3xl border border-red-300/70 bg-gradient-to-br from-red-100/90 via-amber-50/90 to-white p-6 shadow-2xl backdrop-blur-xl dark:border-red-500/30 dark:from-red-900/35 dark:via-orange-950/20 dark:to-slate-900/50">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Siren className="h-5 w-5 text-red-600 dark:text-red-300" />
          <h2 className="text-xl font-semibold">Emergency Alerts</h2>
        </div>
        <Badge variant="destructive" className="rounded-full px-3 py-1">
          <Radio className="mr-1 h-3.5 w-3.5" /> Active
        </Badge>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-red-300/70 bg-white/80 p-5 text-sm text-muted-foreground dark:border-red-300/25 dark:bg-black/20">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <BellRing className="h-4 w-4" />
            No current emergency alerts.
          </div>
          <p className="mt-2">
            Stand by and keep notifications enabled for any new broadcast.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pinnedAlerts.map((alert) => (
            <article
              key={alert._id}
              className="rounded-2xl border border-red-300/70 bg-red-50/90 p-4 shadow-sm dark:border-red-400/30 dark:bg-red-950/20"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold tracking-tight">{alert.title}</p>
                <Badge variant="destructive" className="rounded-full">
                  <AlertTriangle className="mr-1 h-3.5 w-3.5" /> ALERT
                </Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/90">{alert.message}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                Broadcast at {new Date(alert.createdAt).toLocaleString()}
              </div>
              {canDismiss && onDismiss ? (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  onClick={() => onDismiss(alert._id)}
                >
                  Dismiss Alert
                </Button>
              ) : null}
            </article>
          ))}

          {overflowAlerts.length > 0 ? (
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {overflowAlerts.map((alert) => (
                <article
                  key={alert._id}
                  className="rounded-2xl border border-red-300/70 bg-red-50/90 p-4 shadow-sm dark:border-red-400/30 dark:bg-red-950/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold tracking-tight">
                      {alert.title}
                    </p>
                    <Badge variant="destructive" className="rounded-full">
                      <AlertTriangle className="mr-1 h-3.5 w-3.5" /> ALERT
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-foreground/90">
                    {alert.message}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Broadcast at {new Date(alert.createdAt).toLocaleString()}
                  </div>
                  {canDismiss && onDismiss ? (
                    <Button
                      className="mt-3"
                      size="sm"
                      variant="outline"
                      onClick={() => onDismiss(alert._id)}
                    >
                      Dismiss Alert
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
