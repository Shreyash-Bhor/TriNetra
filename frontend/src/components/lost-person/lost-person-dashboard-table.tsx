"use client";

import { useMemo, useState } from "react";
import { LostPersonReport } from "@/types/lostPerson";
import { Button } from "@/components/ui/button";

type LostPersonDashboardTableProps = {
  reports: LostPersonReport[];
  canDismiss?: boolean;
  onDismiss?: (id: string) => Promise<void>;
};

export function LostPersonDashboardTable({
  reports,
  canDismiss = false,
  onDismiss,
}: LostPersonDashboardTableProps) {
  const [view, setView] = useState<"active" | "completed">("active");
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) =>
        view === "active" ? !report.isDismissed : report.isDismissed,
      ),
    [reports, view],
  );

  const handleDismiss = async (id: string) => {
    if (!onDismiss) return;
    setDismissingId(id);
    try {
      await onDismiss(id);
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border border-white/30 bg-white/50 p-1 backdrop-blur dark:border-white/15 dark:bg-white/5">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === "active"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setView("active")}
        >
          Active Reports
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === "completed"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setView("completed")}
        >
          Completed Reports
        </button>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-muted-foreground">No {view} reports available.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/30 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/10">
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3">Reported At</th>
                {canDismiss ? <th className="px-4 py-3">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report._id}
                  className="border-b border-white/15 last:border-0 dark:border-white/10"
                >
                  <td className="px-4 py-3 font-medium">{report.fullName}</td>
                  <td className="px-4 py-3">{report.age}</td>
                  <td className="px-4 py-3 capitalize">{report.gender}</td>
                  <td className="px-4 py-3">
                    {report.createdBy?.username ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                  {canDismiss ? (
                    <td className="px-4 py-3">
                      {report.isDismissed ? (
                        <span className="text-xs text-emerald-600">
                          Completed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDismiss(report._id)}
                          disabled={dismissingId === report._id}
                        >
                          {dismissingId === report._id
                            ? "Updating..."
                            : "Mark as Found"}
                        </Button>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
