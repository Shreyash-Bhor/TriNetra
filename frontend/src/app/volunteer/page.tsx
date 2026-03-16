"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

type LostPersonReport = {
  _id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  createdAt: string;
};

export default function VolunteerDashboard() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "male",
  });
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const fetchReports = async () => {
    const response = await api.get<LostPersonReport[]>("/lost-persons");
    setReports(response.data);
  };

  useEffect(() => {
    fetchReports().catch(() => {
      setMessage("Unable to load reports right now.");
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/lost-persons", {
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
      });

      setFormData({ fullName: "", age: "", gender: "male" });
      setMessage("Lost person report submitted successfully.");
      await fetchReports();
    } catch {
      setMessage("Failed to submit report. Please verify your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <Navigation />

      <div className="px-8 pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Report Lost Person</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm mb-1">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm mb-1">
                  Age
                </label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  max={120}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, age: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
              {message ? <p className="text-sm text-primary">{message}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Lost Person Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-muted-foreground">No reports yet.</p>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 6).map((report) => (
                  <div key={report._id} className="rounded-md border p-3">
                    <p className="font-semibold">{report.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      Age: {report.age} • Gender: {report.gender}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
