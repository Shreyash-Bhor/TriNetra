import { LostPersonReport } from "@/types/lostPerson";

type LostPersonRecentListProps = {
  reports: LostPersonReport[];
};

export function LostPersonRecentList({ reports }: LostPersonRecentListProps) {
  if (reports.length === 0) {
    return <p className="text-muted-foreground">No reports yet.</p>;
  }

  return (
    <div className="space-y-3">
      {reports.slice(0, 6).map((report) => (
        <div key={report._id} className="rounded-md border p-3">
          <p className="font-semibold">{report.fullName}</p>
          <p className="text-sm text-muted-foreground">
            DOB: {new Date(report.dateOfBirth).toLocaleDateString()} • Gender:{" "}
            {report.gender}{" "}
          </p>
        </div>
      ))}
    </div>
  );
}
