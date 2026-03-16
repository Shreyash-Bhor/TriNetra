"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

type LostPersonReport = {
  _id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  createdAt: string;
};

export default function DashboardPage() {
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get<LostPersonReport[]>("/lost-persons");
        setReports(response.data);
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
            <CardTitle className="text-2xl">Dashboard - Lost Person Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="text-red-500">{error}</p> : null}
            {!error && reports.length === 0 ? (
              <p className="text-muted-foreground">No data available yet.</p>
            ) : null}

            {reports.length > 0 ? (
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
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
