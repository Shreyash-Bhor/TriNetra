"use client";

import { useLiveResource } from "@/hooks/use-live-resource";
import { fetchAlerts } from "@/lib/alertApi";
import { LostPersonReport } from "@/types/lostPerson";
import { LostPersonReportsPanel } from "@/components/lost-person/lost-person-reports-panel";

type UserLivePanelsProps = {
  initialReports: LostPersonReport[];
};

export function UserLivePanels({ initialReports }: UserLivePanelsProps) {
  const { data: alertsData } = useLiveResource({
    topic: "alerts",
    fetcher: () => fetchAlerts("volunteer"),
    pollingMs: 5000,
  });

  return (
    <>
      <LostPersonReportsPanel initialReports={initialReports} />
    </>
  );
}
