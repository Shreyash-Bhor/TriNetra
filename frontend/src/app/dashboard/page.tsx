"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import { LostPersonReport } from "@/types/lostPerson";

export default function DashboardPage() {
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchLostPersonReports();
        setReports(data);
      } catch {
        setError("Could not load lost person reports.");
      }
    };

    loadReports();
  }, []);

  return (
    <div className="min-h-screen pb-10">
      <Navigation />

      <div className="px-8 pt-24 max-w-7xl mx-auto">
        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Dashboard - Lost Person Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="text-red-500">{error}</p> : null}
            {!error ? <LostPersonDashboardTable reports={reports} /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
