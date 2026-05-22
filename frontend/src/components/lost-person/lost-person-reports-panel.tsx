"use client";

import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import { LostPersonReport } from "@/types/lostPerson";
import { useLiveResource } from "@/hooks/use-live-resource";

type LostPersonReportsPanelProps = {
  initialReports?: LostPersonReport[];
};

export function LostPersonReportsPanel({
  initialReports = [],
}: LostPersonReportsPanelProps) {
  const { data: reportsData } = useLiveResource({
    topic: "lost-person-reports",
    fetcher: fetchLostPersonReports,
    pollingMs: 5000,
  });

  const reports = reportsData ?? initialReports;

  return (
    <section
      className="h-[30rem] overflow-hidden rounded-3xl border border-white/30
 bg-white/40 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
    >
      <h2 className="mb-4 text-lg font-semibold">Lost Person Reports</h2>
      <div className="h-[calc(30rem-4.5rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <LostPersonDashboardTable reports={reports} />
      </div>
    </section>
  );
}
