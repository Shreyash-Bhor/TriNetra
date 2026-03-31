"use client";

import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostPersonDashboardTable } from "@/components/lost-person/lost-person-dashboard-table";
import { CameraFeedGrid } from "@/components/dashboard/camera-feed-grid";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";
import api from "@/lib/axios";
import { LostPersonReport } from "@/types/lostPerson";
import { CameraCrowdFeed } from "@/types/crowd";

const EXPECTED_CAMERAS = ["CAM_01", "CAM_02", "CAM_03"];

const fetchLatestCameraFeed = async () => {
  const response = await api.get<{ data: CameraCrowdFeed[] }>(
    "/crowd/simulation/latest",
  );
  return response.data;
};

export default function DashboardPage() {
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [cameraFeeds, setCameraFeeds] = useState<CameraCrowdFeed[]>([]);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchLostPersonReports();
        setReports(data);
      } catch {
        setError("Could not load lost person reports.");
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCameraFeed = async () => {
      try {
        const response = await fetchLatestCameraFeed();
        if (!isMounted) {
          return;
        }

        setCameraFeeds(response.data);
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

  const hasAllCameraRows = useMemo(() => {
    const cameraIds = new Set(cameraFeeds.map((feed) => feed.camera_id));
    return EXPECTED_CAMERAS.every((cameraId) => cameraIds.has(cameraId));
  }, [cameraFeeds]);

  return (
    <div className="min-h-screen pb-10">
      <Navigation />

      <div className="px-8 pt-24 max-w-7xl mx-auto space-y-8">
        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Camera Crowd Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cameraError ? <p className="text-red-500">{cameraError}</p> : null}
            {!cameraError && cameraFeeds.length === 0 ? (
              <p className="text-muted-foreground">
                Waiting for camera feed simulation data...
              </p>
            ) : null}
            {!cameraError && cameraFeeds.length > 0 ? (
              <>
                {!hasAllCameraRows ? (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Live feed is available, but not all 3 camera rows have been
                    populated yet.
                  </p>
                ) : null}
                <CameraFeedGrid cameraFeeds={cameraFeeds} />
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Dashboard - Lost Person Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="text-red-500">{error}</p> : null}
            {!error ? <LostPersonDashboardTable reports={reports} /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
