"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BellRing, Camera } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { CameraFeedGrid } from "@/components/admin/camera-feed-grid";
import { CrowdDensityMapCard } from "@/components/admin/crowd-density-map-card";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { acknowledgeAlert, createAlert, fetchAlerts } from "@/lib/alertApi";
import api from "@/lib/axios";
import {
  dismissLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { CameraCrowdFeed } from "@/types/crowd";
type RegisteredVolunteer = {
  _id: string;
  username: string;
  location?: string;
};
import { RoleGuard } from "@/components/auth/role-guard";
import { publishRealtimeUpdate, subscribeRealtimeUpdate } from "@/lib/realtime";
import { useLiveResource } from "@/hooks/use-live-resource";

const EXPECTED_CAMERAS = ["CAM_01", "CAM_02", "CAM_03"];

const fetchLatestCameraFeed = async () => {
  const response = await api.get<{ data: CameraCrowdFeed[] }>(
    "/crowd/simulation/latest",
  );
  return response.data;
};

const glassCardClass =
  "glass-strong rounded-3xl border border-white/25 shadow-2xl shadow-black/10 dark:border-white/15";

export default function AdminPage() {
  const [cameraFeeds, setCameraFeeds] = useState<CameraCrowdFeed[]>([]);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const loadAdminData = async () => {
    const [lostPersonData, alertData, volunteerData] = await Promise.all([
      fetchLostPersonReports(),
      fetchAlerts("admin"),
      api.get<{ volunteers: RegisteredVolunteer[] }>("/auth/volunteers"),
    ]);

    return {
      reports: lostPersonData,
      alerts: alertData,
      volunteers: volunteerData.data.volunteers,
    };
  };
  const { data: adminData, refresh: refreshAdminData } = useLiveResource({
    topic: "alerts",
    fetcher: loadAdminData,
    pollingMs: 5000,
    onError: () => setError("Could not load admin dashboard data."),
  });
  useEffect(() => {
    const refreshReports = () => {
      refreshAdminData().catch(() =>
        setError("Could not load admin dashboard data."),
      );
    };

    const unsubscribe = [
      ["lost-person-reports", refreshReports],
      ["volunteers", refreshReports],
    ] as const;

    const disposers = unsubscribe.map(([topic, handler]) =>
      subscribeRealtimeUpdate(topic, handler),
    );

    return () => {
      disposers.forEach((dispose: () => void) => dispose());
    };
  }, [refreshAdminData]);

  const reports = adminData?.reports ?? [];
  const alerts = adminData?.alerts ?? [];
  const volunteers = adminData?.volunteers ?? [];

  useEffect(() => {
    let isMounted = true;

    const loadCameraFeed = async () => {
      try {
        const response = await fetchLatestCameraFeed();
        if (!isMounted) return;

        setCameraFeeds(
          response.data.map((feed) => ({
            ...feed,
            count: Math.round(feed.count),
          })),
        );
        setCameraError("");
      } catch {
        if (isMounted) {
          setCameraError("Could not load camera feed data.");
        }
      }
    };

    loadCameraFeed();
    const interval = setInterval(loadCameraFeed, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      await createAlert({
        title: alertTitle,
        message: alertMessage,
      });
      setAlertTitle("");
      setAlertMessage("");
      setStatusMessage("Alert created and published to all pages.");
      await refreshAdminData();
      publishRealtimeUpdate("alerts");
    } catch {
      setStatusMessage("Failed to create alert.");
    }
  };

  const handleAcknowledge = async (id: string) => {
    setStatusMessage("");

    try {
      await acknowledgeAlert(id);
      setStatusMessage("Alert acknowledged and published.");
      await refreshAdminData();
      publishRealtimeUpdate("alerts");
    } catch {
      setStatusMessage("Failed to acknowledge alert.");
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      await dismissLostPersonReport(id);
      await refreshAdminData();
      publishRealtimeUpdate("alerts");
    } catch {
      setStatusMessage("Failed to update lost person report.");
    }
  };
  const pendingAlerts = alerts.filter((alert) => alert.status === "pending");
  const activeAlerts = alerts.filter((alert) => alert.status === "active");

  const hasAllCameraRows = useMemo(() => {
    const cameraIds = new Set(cameraFeeds.map((feed) => feed.camera_id));
    return EXPECTED_CAMERAS.every((cameraId) => cameraIds.has(cameraId));
  }, [cameraFeeds]);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="relative min-h-screen overflow-x-hidden pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.24),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.20),transparent_45%)]" />

        <Navigation />

        <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-24 sm:px-8">
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                Admin Command Center
              </CardTitle>
              <CardDescription>
                Unified operations for alerts, crowd monitoring, and lost person
                response.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5">
                <p className="text-xs uppercase text-muted-foreground">
                  Pending Alerts
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {pendingAlerts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5">
                <p className="text-xs uppercase text-muted-foreground">
                  Active Alerts
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {activeAlerts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5">
                <p className="text-xs uppercase text-muted-foreground">
                  Tracked Cameras
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {cameraFeeds.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5">
                <p className="text-xs uppercase text-muted-foreground">
                  Lost Person Reports
                </p>
                <p className="mt-2 text-3xl font-semibold">{reports.length}</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5">
                <p className="text-xs uppercase text-muted-foreground">
                  Registered Volunteers
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {volunteers.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className="text-2xl">Registered Volunteers</CardTitle>
              <CardDescription>
                Latest volunteer signups with selected operating location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {volunteers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No volunteers registered yet.
                </p>
              ) : (
                volunteers.map((volunteer) => (
                  <div
                    key={volunteer._id}
                    className="rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5"
                  >
                    <p className="font-semibold">{volunteer.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Location: {volunteer.location ?? "Not selected"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className={glassCardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BellRing className="h-5 w-5" /> Create Emergency Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <Input
                    value={alertTitle}
                    onChange={(event) => setAlertTitle(event.target.value)}
                    placeholder="Alert title"
                    className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
                    required
                  />
                  <Input
                    value={alertMessage}
                    onChange={(event) => setAlertMessage(event.target.value)}
                    placeholder="Alert message"
                    className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
                    required
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Publish Alert
                  </Button>
                </form>
                {statusMessage ? (
                  <p className="mt-3 text-sm">{statusMessage}</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className={glassCardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <AlertTriangle className="h-5 w-5" /> Pending Volunteer Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingAlerts.length === 0 ? <p>No pending alerts.</p> : null}
                {pendingAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    className="space-y-3 rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5"
                  >
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
          </section>

          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Camera className="h-5 w-5" /> Camera Crowd Monitoring
              </CardTitle>
              <CardDescription>
                Realtime simulation feed with density and status per camera.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cameraError ? (
                <p className="text-red-500">{cameraError}</p>
              ) : null}

              {!cameraError && cameraFeeds.length === 0 ? (
                <p className="text-muted-foreground">
                  Waiting for camera feed simulation data...
                </p>
              ) : null}

              {!cameraError && cameraFeeds.length > 0 ? (
                <>
                  {!hasAllCameraRows ? (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Live feed is available, but not all 3 camera rows have
                      been populated yet.
                    </p>
                  ) : null}
                  <CameraFeedGrid cameraFeeds={cameraFeeds} />
                </>
              ) : null}
            </CardContent>
          </Card>

          <CrowdDensityMapCard />

          <section className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            <Card className={`xl:col-span-12 ${glassCardClass}`}>
              <CardHeader>
                <CardTitle className="text-2xl">Lost Person Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <LostPersonDashboardTable
                    reports={reports}
                    canDismiss
                    onDismiss={handleDismissReport}
                  />
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </RoleGuard>
  );
}
