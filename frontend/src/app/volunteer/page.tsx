"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostPersonForm } from "@/components/lost-person/lost-person-form";
import { LostPersonRecentList } from "@/components/lost-person/lost-person-recent-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { createAlert, fetchAlerts } from "@/lib/alertApi";
import { LostPersonGender, LostPersonReport } from "@/types/lostPerson";
import { SiteAlert } from "@/types/alert";

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
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [alerts, setAlerts] = useState<SiteAlert[]>([]);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatusMessage, setAlertStatusMessage] = useState("");

  const loadReports = async () => {
    const data = await fetchLostPersonReports();
    setReports(data);
  };

  const loadAlerts = async () => {
    const data = await fetchAlerts("volunteer");
    setAlerts(data);
  };

  useEffect(() => {
    loadReports().catch(() => {
      setMessage("Unable to load reports right now.");
    });

    loadAlerts().catch(() => {
      setAlertStatusMessage("Unable to load alerts right now.");
    });
  }, []);

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
        createdByRole: "volunteer",
      });
      setAlertTitle("");
      setAlertMessage("");
      setAlertStatusMessage(
        "Alert sent to admin. It will be visible after admin acknowledgement.",
      );
      await loadAlerts();
    } catch {
      setAlertStatusMessage("Failed to create alert. Check your inputs.");
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
            <LostPersonRecentList reports={reports} />
          </CardContent>
        </Card>
      </div>

      <div className="px-8 pt-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Active Site Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-muted-foreground">No active alerts.</p>
            ) : null}
            {alerts.map((alert) => (
              <div key={alert._id} className="rounded-xl border p-4">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs mt-2">
                  Created by: {alert.createdByRole}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
