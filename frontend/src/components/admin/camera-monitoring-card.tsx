"use client";

import { Camera } from "lucide-react";
import { CameraFeedGrid } from "@/components/admin/camera-feed-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CameraCrowdFeed } from "@/types/crowd";
import {
  glassCardClass,
  moduleHeightClass,
} from "@/components/admin/admin-dashboard-shared";

type Props = {
  cameraError: string;
  cameraFeeds: CameraCrowdFeed[];
  hasAllCameraRows: boolean;
};

export function CameraMonitoringCard({
  cameraError,
  cameraFeeds,
  hasAllCameraRows,
}: Props) {
  return (
    <Card className={glassCardClass}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-sky-700 dark:text-sky-300">
          <Camera className="h-5 w-5" /> Camera Crowd Monitoring
        </CardTitle>
        <CardDescription>
          Realtime simulation feed with density and status per camera.
        </CardDescription>
      </CardHeader>
      <CardContent className={`space-y-4 overflow-hidden ${moduleHeightClass}`}>
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
  );
}
