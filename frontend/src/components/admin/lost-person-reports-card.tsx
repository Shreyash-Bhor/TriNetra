"use client";

import { UserRoundSearch } from "lucide-react";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  glassCardClass,
  moduleHeightClass,
} from "@/components/admin/admin-dashboard-shared";
import { LostPersonReport } from "@/types/lostPerson";

type Props = {
  error: string;
  reports: LostPersonReport[];
  onDismiss: (id: string) => Promise<void>;
};

export function LostPersonReportsCard({ error, reports, onDismiss }: Props) {
  return (
    <section className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
      <Card className={`xl:col-span-12 ${glassCardClass}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-violet-700 dark:text-violet-300">
            <UserRoundSearch className="h-5 w-5" /> Lost Person Reports
          </CardTitle>
        </CardHeader>
        <CardContent className={`overflow-hidden ${moduleHeightClass}`}>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <LostPersonDashboardTable
              reports={reports}
              canDismiss
              onDismiss={onDismiss}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
