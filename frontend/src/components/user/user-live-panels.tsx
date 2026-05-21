"use client";

import { useLiveResource } from "@/hooks/use-live-resource";
import { fetchAlerts } from "@/lib/alertApi";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import { LostPersonReport } from "@/types/lostPerson";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";

type UserLivePanelsProps = {
  initialReports: LostPersonReport[];
};

export function UserLivePanels({ initialReports }: UserLivePanelsProps) {
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

  const reports = reportsData ?? initialReports;

  return (
    <>
      <section className="rounded-3xl border border-white/30 bg-white/40 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold">Lost Person Reports</h2>
        <LostPersonDashboardTable reports={reports} />
      </section>
    </>
  );
}
