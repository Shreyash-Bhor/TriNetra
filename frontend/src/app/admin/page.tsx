"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import { acknowledgeAlert, createAlert, fetchAlerts } from "@/lib/alertApi";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { LostPersonReport } from "@/types/lostPerson";
import { SiteAlert } from "@/types/alert";
import { CrowdDensityMapCard } from "@/components/dashboard/crowd-density-map-card";

export default function AdminPage() {
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [alerts, setAlerts] = useState<SiteAlert[]>([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const loadData = async () => {
    const [lostPersonData, alertData] = await Promise.all([
      fetchLostPersonReports(),
      fetchAlerts("admin"),
    ]);

    setReports(lostPersonData);
    setAlerts(alertData);
  };

  useEffect(() => {
    loadData().catch(() => {
      setError("Could not load admin dashboard data.");
    });
  }, []);

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      await createAlert({
        title: alertTitle,
        message: alertMessage,
        createdByRole: "admin",
      });
      setAlertTitle("");
      setAlertMessage("");
      setStatusMessage("Alert created and published to all pages.");
      await loadData();
    } catch {
      setStatusMessage("Failed to create alert.");
    }
  };

  const handleAcknowledge = async (id: string) => {
    setStatusMessage("");

    try {
      await acknowledgeAlert(id);
      setStatusMessage("Alert acknowledged and published.");
      await loadData();
    } catch {
      setStatusMessage("Failed to acknowledge alert.");
    }
  };

  const pendingAlerts = alerts.filter((alert) => alert.status === "pending");
  const activeAlerts = alerts.filter((alert) => alert.status === "active");

  return (
    <div className="min-h-screen pb-10">
      <Navigation />

      <div className="px-8 pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Emergency Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <Input
                value={alertTitle}
                onChange={(event) => setAlertTitle(event.target.value)}
                placeholder="Alert title"
                required
              />
              <Input
                value={alertMessage}
                onChange={(event) => setAlertMessage(event.target.value)}
                placeholder="Alert message"
                required
              />
              <Button type="submit">Publish Alert</Button>
            </form>
            {statusMessage ? (
              <p className="mt-3 text-sm">{statusMessage}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Pending Volunteer Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAlerts.length === 0 ? <p>No pending alerts.</p> : null}
            {pendingAlerts.map((alert) => (
              <div key={alert._id} className="rounded-xl border p-4 space-y-3">
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
                <Button onClick={() => handleAcknowledge(alert._id)}>
                  Acknowledge & Publish
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="px-8 pt-8 max-w-7xl mx-auto grid grid-cols-1 gap-8">
        <CrowdDensityMapCard />

        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Live Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.length === 0 ? <p>No active alerts.</p> : null}
            {activeAlerts.map((alert) => (
              <div key={alert._id} className="rounded-xl border p-4">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Dashboard - Lost Person Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <LostPersonDashboardTable reports={reports} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
