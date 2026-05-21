"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { VolunteerLiveAlerts } from "@/components/volunteer/volunteer-live-alerts";
import { Button } from "@/components/ui/button";
import { AppRole } from "@/lib/auth";
import { dismissAlert, fetchAlerts } from "@/lib/alertApi";
import { useLiveResource } from "@/hooks/use-live-resource";
import { publishRealtimeUpdate } from "@/lib/realtime";

type AlertsMenuProps = {
  role?: AppRole;
};

export function AlertsMenu({ role }: AlertsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const canLoadAlerts = Boolean(role);
  const fetcherRole = role === "admin" ? "admin" : "volunteer";

  const { data: alertsData, refresh } = useLiveResource({
    topic: "alerts",
    fetcher: () => fetchAlerts(fetcherRole),
    pollingMs: 5000,
  });

  const visibleAlerts = useMemo(() => {
    if (!canLoadAlerts) return [];
    const alerts = alertsData ?? [];
    if (role === "admin") {
      return alerts;
    }
    return alerts.filter((alert) => alert.status === "active");
  }, [alertsData, canLoadAlerts, role]);

  const handleDismiss = async (id: string) => {
    await dismissAlert(id);
    await refresh();
    publishRealtimeUpdate("alerts");
  };

  if (!canLoadAlerts) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full border border-white/20 bg-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <Bell className="h-4 w-4" />
        {visibleAlerts.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {visibleAlerts.length}
          </span>
        ) : null}
        <span className="sr-only">Toggle alerts</span>
      </Button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-[min(92vw,30rem)]">
          <VolunteerLiveAlerts
            alerts={visibleAlerts}
            canDismiss={role === "admin"}
            onDismiss={role === "admin" ? handleDismiss : undefined}
          />
        </div>
      ) : null}
    </div>
  );
}
