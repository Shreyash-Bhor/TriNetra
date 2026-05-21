"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Camera,
  UserRoundSearch,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { publishRealtimeUpdate, subscribeRealtimeUpdate } from "@/lib/realtime";
import { useLiveResource } from "@/hooks/use-live-resource";
import { acknowledgeAlert, createAlert, fetchAlerts } from "@/lib/alertApi";
import api from "@/lib/axios";
import {
  dismissLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { CameraCrowdFeed } from "@/types/crowd";
import { AlertModulesRow } from "@/components/admin/alert-modules-row";
import { AdminKpiCards } from "@/components/admin/admin-kpi-cards";
import { CameraMonitoringCard } from "@/components/admin/camera-monitoring-card";
import { CrowdDensityMapCard } from "@/components/admin/crowd-density-map-card";
import { LostPersonReportsCard } from "@/components/admin/lost-person-reports-card";
import {
  AdminDashboardData,
  AdminKpiCard,
  EXPECTED_CAMERAS,
  RegisteredVolunteer,
  moduleHeightClass,
  normalizeCameraFeeds,
} from "@/components/admin/admin-dashboard-shared";
import { VolunteersModal } from "@/components/admin/volunteers-modal";

const fetchLatestCameraFeed = async () => {
  const response = await api.get<{ data: CameraCrowdFeed[] }>(
    "/crowd/simulation/latest",
  );
  return response.data;
};

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

  const loadAdminData = async (): Promise<AdminDashboardData> => {
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
    onSuccess: () => setError(""),
    onError: () => setError("Could not load admin dashboard data."),
  });
  const reports = useMemo(() => adminData?.reports ?? [], [adminData?.reports]);
  const alerts = useMemo(() => adminData?.alerts ?? [], [adminData?.alerts]);
  const volunteers = useMemo(
    () => adminData?.volunteers ?? [],
    [adminData?.volunteers],
  );

  useEffect(() => {
    const refreshReports = () =>
      refreshAdminData().catch(() =>
        setError("Could not load admin dashboard data."),
      );
    const disposers = (["lost-person-reports", "volunteers"] as const).map(
      (topic) => subscribeRealtimeUpdate(topic, refreshReports),
    );
    return () => disposers.forEach((dispose) => dispose());
  }, [refreshAdminData]);

  useEffect(() => {
    let isMounted = true;

    const loadCameraFeed = async () => {
      try {
        const response = await fetchLatestCameraFeed();
        if (!isMounted) return;
        setCameraFeeds(normalizeCameraFeeds(response.data));
        setCameraError("");
      } catch {
        if (isMounted) setCameraError("Could not load camera feed data.");
      }
    };

    loadCameraFeed();
    const interval = setInterval(loadCameraFeed, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const pendingAlerts = alerts.filter((alert) => alert.status === "pending");
  const activeAlerts = alerts.filter((alert) => alert.status === "active");

  const locationOptions = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        volunteers.map((volunteer) => volunteer.location).filter(Boolean),
      ),
    ) as string[];
    return ["all", ...uniqueLocations.sort((a, b) => a.localeCompare(b))];
  }, [volunteers]);

  const filteredVolunteers = useMemo(
    () =>
      volunteers.filter(
        (volunteer) =>
          (locationFilter === "all" || volunteer.location === locationFilter) &&
          volunteer.username
            .toLowerCase()
            .includes(usernameSearch.toLowerCase().trim()),
      ),
    [locationFilter, usernameSearch, volunteers],
  );

  const hasAllCameraRows = useMemo(() => {
    const cameraIds = new Set(cameraFeeds.map((feed) => feed.camera_id));
    return EXPECTED_CAMERAS.every((cameraId) => cameraIds.has(cameraId));
  }, [cameraFeeds]);

  const previousKpiRef = useRef<Record<string, number>>({});
  const kpis = useMemo<AdminKpiCard[]>(
    () => [
      {
        key: "pending-alerts",
        label: "Pending Alerts",
        value: pendingAlerts.length,
        icon: BellRing,
        toneClass: "text-amber-700 dark:text-amber-300",
      },
      {
        key: "active-alerts",
        label: "Active Alerts",
        value: activeAlerts.length,
        icon: AlertTriangle,
        toneClass: "text-rose-700 dark:text-rose-300",
      },
      {
        key: "tracked-cameras",
        label: "Tracked Cameras",
        value: cameraFeeds.length,
        icon: Camera,
        toneClass: "text-sky-700 dark:text-sky-300",
      },
      {
        key: "lost-reports",
        label: "Lost Person Reports",
        value: reports.length,
        icon: UserRoundSearch,
        toneClass: "text-violet-700 dark:text-violet-300",
      },
      {
        key: "registered-volunteers",
        label: "Registered Volunteers",
        value: volunteers.length,
        icon: Users,
        toneClass: "text-emerald-700 dark:text-emerald-300",
      },
    ],
    [
      activeAlerts.length,
      cameraFeeds.length,
      pendingAlerts.length,
      reports.length,
      volunteers.length,
    ],
  );

  const kpiChanges = useMemo(() => {
    const previous = previousKpiRef.current;
    return Object.fromEntries(
      kpis.map((kpi) => [
        kpi.key,
        kpi.value - (previous[kpi.key] ?? kpi.value),
      ]),
    );
  }, [kpis]);

  useEffect(() => {
    previousKpiRef.current = Object.fromEntries(
      kpis.map((kpi) => [kpi.key, kpi.value]),
    );
  }, [kpis]);

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      await createAlert({ title: alertTitle, message: alertMessage });
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
        <VolunteersModal
          isOpen={isVolunteersOpen}
          locationFilter={locationFilter}
          usernameSearch={usernameSearch}
          locationOptions={locationOptions}
          volunteers={filteredVolunteers}
          onClose={() => setIsVolunteersOpen(false)}
          onLocationFilterChange={setLocationFilter}
          onUsernameSearchChange={setUsernameSearch}
        />

        <main
          className={`relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-24 transition sm:px-8 ${isVolunteersOpen ? "pointer-events-none blur-sm" : ""}`}
        >
          <AdminKpiCards kpis={kpis} kpiChanges={kpiChanges} />
          <CameraMonitoringCard
            cameraError={cameraError}
            cameraFeeds={cameraFeeds}
            hasAllCameraRows={hasAllCameraRows}
          />
          <div className={moduleHeightClass}>
            <CrowdDensityMapCard />
          </div>
          <AlertModulesRow
            alertTitle={alertTitle}
            alertMessage={alertMessage}
            statusMessage={statusMessage}
            pendingAlerts={pendingAlerts}
            onAlertTitleChange={setAlertTitle}
            onAlertMessageChange={setAlertMessage}
            onCreateAlert={handleCreateAlert}
            onAcknowledge={handleAcknowledge}
          />
          <LostPersonReportsCard
            error={error}
            reports={reports}
            onDismiss={handleDismissReport}
          />
        </main>
      </div>
    </RoleGuard>
  );
}
