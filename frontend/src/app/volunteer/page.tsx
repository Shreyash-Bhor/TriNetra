"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostPersonForm } from "@/components/lost-person/lost-person-form";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createLostPersonReport,
  dismissLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { createAlert } from "@/lib/alertApi";
import { LostPersonGender } from "@/types/lostPerson";
import { RoleGuard } from "@/components/auth/role-guard";
import { publishRealtimeUpdate } from "@/lib/realtime";
import { useLiveResource } from "@/hooks/use-live-resource";
import { CrowdDensityMapCard } from "@/components/admin/crowd-density-map-card";

type LostPersonFormValues = {
  fullName: string;
  age: string;
  gender: LostPersonGender;
};

const defaultFormValues: LostPersonFormValues = {
  fullName: "",
  age: "",
  gender: "male",
};

export default function VolunteerDashboard() {
  const [formData, setFormData] =
    useState<LostPersonFormValues>(defaultFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatusMessage, setAlertStatusMessage] = useState("");

  const { data: reportsData, refresh: loadReports } = useLiveResource({
    topic: "lost-person-reports",
    fetcher: fetchLostPersonReports,
    pollingMs: 5000,
    onError: () => setMessage("Unable to load reports right now."),
  });

  const reports = reportsData ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await createLostPersonReport({
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
      });

      setFormData(defaultFormValues);
      setMessage("Lost person report submitted successfully.");
      await loadReports();
      publishRealtimeUpdate("lost-person-reports");
    } catch {
      setMessage("Failed to submit report. Please verify your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlertStatusMessage("");

    try {
      await createAlert({
        title: alertTitle,
        message: alertMessage,
      });
      setAlertTitle("");
      setAlertMessage("");
      setAlertStatusMessage(
        "Alert sent to admin. It will be visible after admin acknowledgement.",
      );
      publishRealtimeUpdate("alerts");
    } catch {
      setAlertStatusMessage("Failed to create alert. Check your inputs.");
    }
  };

  return (
    <RoleGuard allowedRoles={["volunteer"]}>
      <div className="min-h-screen pb-10">
        <Navigation />

        <div className="px-8 pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Report Lost Person</CardTitle>
            </CardHeader>
            <CardContent>
              <LostPersonForm
                formData={formData}
                isSubmitting={isSubmitting}
                message={message}
                onChange={setFormData}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                Recent Lost Person Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LostPersonDashboardTable
                reports={reports}
                canDismiss
                onDismiss={async (id) => {
                  await dismissLostPersonReport(id);
                  await loadReports();
                  publishRealtimeUpdate("lost-person-reports");
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="px-8 pt-8 max-w-7xl mx-auto">
          <CrowdDensityMapCard />
        </div>

        <div className="px-8 pt-8 max-w-7xl mx-auto">
          <Card className="rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Create Emergency Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <Input
                  placeholder="Alert title"
                  value={alertTitle}
                  onChange={(event) => setAlertTitle(event.target.value)}
                  required
                />
                <Input
                  placeholder="Alert message"
                  value={alertMessage}
                  onChange={(event) => setAlertMessage(event.target.value)}
                  required
                />
                <Button type="submit">Send alert to admin</Button>
                {alertStatusMessage ? (
                  <p className="text-sm text-muted-foreground">
                    {alertStatusMessage}
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
