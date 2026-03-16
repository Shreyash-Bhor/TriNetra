import { LostPersonReport } from "@/types/lostPerson";

type LostPersonDashboardTableProps = {
  reports: LostPersonReport[];
};

export function LostPersonDashboardTable({
  reports,
}: LostPersonDashboardTableProps) {
  if (reports.length === 0) {
    return <p className="text-muted-foreground">No data available yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Full Name</th>
            <th className="py-2">Age</th>
            <th className="py-2">Gender</th>
            <th className="py-2">Reported At</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-b last:border-0">
              <td className="py-3">{report.fullName}</td>
              <td className="py-3">{report.age}</td>
              <td className="py-3 capitalize">{report.gender}</td>
              <td className="py-3">
                {new Date(report.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
