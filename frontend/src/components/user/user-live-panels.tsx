"use client";

import { useLiveResource } from "@/hooks/use-live-resource";
import { fetchAlerts } from "@/lib/alertApi";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import { SiteAlert } from "@/types/alert";
import { LostPersonReport } from "@/types/lostPerson";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { VolunteerLiveAlerts } from "@/components/volunteer/volunteer-live-alerts";

type UserLivePanelsProps = {
  initialAlerts: SiteAlert[];
  initialReports: LostPersonReport[];
};

export function UserLivePanels({
  initialAlerts,
  initialReports,
}: UserLivePanelsProps) {
  const { data: alertsData } = useLiveResource({
    topic: "alerts",
    fetcher: () => fetchAlerts("volunteer"),
    pollingMs: 5000,
  });

  const { data: reportsData } = useLiveResource({
    topic: "lost-person-reports",
    fetcher: fetchLostPersonReports,
    pollingMs: 5000,
  });

  const alerts = alertsData ?? initialAlerts;
  const reports = reportsData ?? initialReports;

  return (
    <>
      <VolunteerLiveAlerts alerts={alerts} />
      <section className="rounded-3xl border border-white/30 bg-white/40 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold">Lost Person Reports</h2>
        <LostPersonDashboardTable reports={reports} />
      </section>
    </>
  );
}
