"use client";

import { CrowdDensityMap } from "@/components/admin/crowd-density-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrowdMapFeed } from "@/hooks/useCrowdMapFeed";

export function VolunteerCrowdDensityMapCard() {
  const {
    cameraFeeds,
    errorMessage,
    isInitialLoading,
    isRefreshing,
    lastUpdated,
  } = useCrowdMapFeed();

  return (
    <Card className="glass-strong rounded-3xl border border-slate-300/80 shadow-2xl shadow-black/10 transition-all duration-300 dark:border-white/15">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-700 dark:text-cyan-300">
          Live Crowd Density Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isInitialLoading ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            Initializing map service and loading crowd coordinates...
          </div>
        ) : null}

        {!isInitialLoading && errorMessage ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            {errorMessage}
          </div>
        ) : null}

        {!isInitialLoading && cameraFeeds.length === 0 ? (
          <div className="rounded-xl border p-4 text-sm text-muted-foreground">
            No coordinates available from the backend yet.
          </div>
        ) : null}

        {!isInitialLoading && cameraFeeds.length > 0 ? (
          <>
            <CrowdDensityMap cameraFeeds={cameraFeeds} />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <p>
                Marker colors: <span className="text-red-500">HIGH</span>,{" "}
                <span className="text-yellow-500">MEDIUM</span>,{" "}
                <span className="text-green-500">LOW</span>
              </p>
              <p>
                {isRefreshing
                  ? "Refreshing map data..."
                  : "Live updates active."}
                {lastUpdated
                  ? ` Last sync: ${new Date(lastUpdated).toLocaleTimeString()}`
                  : ""}
              </p>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
