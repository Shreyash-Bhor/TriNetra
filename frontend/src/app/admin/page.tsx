"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BellRing, Camera, Search, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  firstName: string;
  lastName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
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
  const [isVolunteersOpen, setIsVolunteersOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");
  const [usernameSearch, setUsernameSearch] = useState("");
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

  const reports = useMemo(() => adminData?.reports ?? [], [adminData?.reports]);
  const alerts = useMemo(() => adminData?.alerts ?? [], [adminData?.alerts]);
  const volunteers = useMemo(
    () => adminData?.volunteers ?? [],
    [adminData?.volunteers],
  );
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
  const locationOptions = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        volunteers.map((volunteer) => volunteer.location).filter(Boolean),
      ),
    ) as string[];

    return ["all", ...uniqueLocations.sort((a, b) => a.localeCompare(b))];
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const locationMatches =
        locationFilter === "all" || volunteer.location === locationFilter;
      const usernameMatches = volunteer.username
        .toLowerCase()
        .includes(usernameSearch.toLowerCase().trim());

      return locationMatches && usernameMatches;
    });
  }, [locationFilter, usernameSearch, volunteers]);

  const isRecent = (timestamp: string) => {
    const oneDayMs = 24 * 60 * 60 * 1000;
    return Date.now() - new Date(timestamp).getTime() <= oneDayMs;
  };

  const hasRecentlyUpdatedLocation = (volunteer: RegisteredVolunteer) => {
    if (!volunteer.location) return false;

    return (
      isRecent(volunteer.updatedAt) &&
      new Date(volunteer.updatedAt).getTime() >
        new Date(volunteer.createdAt).getTime()
    );
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="relative min-h-screen overflow-x-hidden pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.24),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.20),transparent_45%)]" />

        <Navigation />

        <div className="fixed right-4 top-20 z-40 sm:right-8">
          <Button
            type="button"
            variant="outline"
            className="border-white/30 bg-white/55 backdrop-blur-md dark:border-white/15 dark:bg-black/35"
            onClick={() => setIsVolunteersOpen(true)}
          >
            Registered Volunteers
          </Button>
        </div>

        {isVolunteersOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
            <Card className="h-[90vh] w-[90vw] min-h-[360px] min-w-[320px] overflow-hidden border border-white/30 bg-white/85 shadow-2xl dark:border-white/15 dark:bg-black/75">
              <CardHeader className="border-b border-white/20 pb-4 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">
                      Registered Volunteers
                    </CardTitle>
                    <CardDescription>
                      Filter by location and search by username.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVolunteersOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    className="h-10 rounded-xl border border-white/30 bg-white/65 px-3 text-sm outline-none dark:border-white/15 dark:bg-black/30"
                  >
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-1 items-center gap-2">
                    <Button type="button" variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Input
                      value={usernameSearch}
                      onChange={(event) =>
                        setUsernameSearch(event.target.value)
                      }
                      placeholder="Search by username"
                      className="border-white/30 bg-white/65 dark:border-white/15 dark:bg-black/30"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[90vh] overflow-y-auto space-y-3 pt-4">
                {filteredVolunteers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No volunteers found.
                  </p>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <div
                      key={volunteer._id}
                      className="space-y-2 rounded-2xl border border-white/30 bg-white/55 p-4 dark:border-white/15 dark:bg-white/5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{volunteer.username}</p>
                        <div className="flex flex-wrap gap-2">
                          {isRecent(volunteer.createdAt) ? (
                            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              New volunteer
                            </Badge>
                          ) : null}
                          {hasRecentlyUpdatedLocation(volunteer) ? (
                            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300">
                              Location updated recently
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm">
                        First Name: {volunteer.firstName}
                      </p>
                      <p className="text-sm">
                        Last Name: {volunteer.lastName ?? "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Assigned location:{" "}
                        {volunteer.location ?? "Not selected"}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        <main
          className={`relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-24 transition sm:px-8 ${
            isVolunteersOpen ? "pointer-events-none blur-sm" : ""
          }`}
        >
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
