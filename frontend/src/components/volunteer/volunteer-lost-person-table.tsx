"use client";

import { useMemo, useState } from "react";
import { LostPersonReport } from "@/types/lostPerson";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const parseDateValue = (value: string) => {
  if (!value?.trim()) return null;
  const directDate = new Date(value.trim());
  if (!Number.isNaN(directDate.getTime())) return directDate;
  const slashMatch = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!slashMatch) return null;
  const [, day, month, year] = slashMatch;
  const slashDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  return Number.isNaN(slashDate.getTime()) ? null : slashDate;
};

const formatDate = (value: string) => {
  const parsed = parseDateValue(value);
  return parsed ? dateFormatter.format(parsed) : "Unknown";
};

const formatDateTime = (value: string) => {
  const parsed = parseDateValue(value);
  return parsed ? dateTimeFormatter.format(parsed) : "Unknown";
};

type Props = {
  reports: LostPersonReport[];
  canDismiss?: boolean;
  onDismiss?: (id: string) => Promise<void>;
};

export function VolunteerLostPersonTable({
  reports,
  canDismiss = false,
  onDismiss,
}: Props) {
  const [view, setView] = useState<"active" | "completed">("active");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const locationOptions = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        reports.map((report) => report.createdBy?.location).filter(Boolean),
      ),
    ) as string[];
    return ["all", ...uniqueLocations.sort((a, b) => a.localeCompare(b))];
  }, [reports]);

  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          (view === "active" ? !report.isDismissed : report.isDismissed) &&
          (locationFilter === "all" ||
            report.createdBy?.location === locationFilter),
      ),
    [locationFilter, reports, view],
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
    <div className="flex h-full min-h-0 flex-col space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="inline-flex rounded-xl border border-white/30 bg-white/50 p-1 backdrop-blur dark:border-white/15 dark:bg-white/5">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${view === "active" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setView("active")}
          >
            Active Reports
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${view === "completed" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setView("completed")}
          >
            Completed Reports
          </button>
        </div>
        <div className="w-full max-w-xs">
          <label
            htmlFor="report-location-filter"
            className="mb-1 block text-sm text-muted-foreground"
          >
            Filter by location
          </label>
          <select
            id="report-location-filter"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          >
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {location === "all" ? "All locations" : location}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredReports.length === 0 ? (
        <p className="text-muted-foreground">No {view} reports available.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-white/20 bg-white/30 backdrop-blur [scrollbar-width:none] dark:border-white/10 dark:bg-white/5 [&::-webkit-scrollbar]:hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/10">
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Date of Birth</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3">Location</th>
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
                  <td className="truncate px-4 py-3 font-medium">
                    {report.fullName}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(report.dateOfBirth)}
                  </td>
                  <td className="truncate px-4 py-3 capitalize">
                    {report.gender}
                  </td>
                  <td className="truncate px-4 py-3">
                    {report.createdBy?.username ?? "Unknown"}
                  </td>
                  <td className="truncate px-4 py-3">
                    {report.createdBy?.location ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(report.createdAt)}
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
