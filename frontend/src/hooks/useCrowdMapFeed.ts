"use client";

import { useEffect, useState } from "react";
import { fetchLatestCameraFeed, getCrowdMapRefreshMs } from "@/lib/crowdMapApi";
import { CameraCrowdFeed } from "@/types/crowd";

type CrowdMapFeedState = {
  cameraFeeds: CameraCrowdFeed[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string;
  lastUpdated: string | null;
};

export function useCrowdMapFeed() {
  const [state, setState] = useState<CrowdMapFeedState>({
    cameraFeeds: [],
    isInitialLoading: true,
    isRefreshing: false,
    errorMessage: "",
    lastUpdated: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadFeed = async (isInitial = false) => {
      setState((previous) => ({
        ...previous,
        isInitialLoading: isInitial,
        isRefreshing: !isInitial,
      }));

      try {
        const cameraFeeds = await fetchLatestCameraFeed();

        if (!isMounted) {
          return;
        }

        setState({
          cameraFeeds,
          isInitialLoading: false,
          isRefreshing: false,
          errorMessage: "",
          lastUpdated: new Date().toISOString(),
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState((previous) => ({
          ...previous,
          isInitialLoading: false,
          isRefreshing: false,
          errorMessage:
            "Map data is temporarily unavailable. Retrying automatically.",
        }));
      }
    };

    loadFeed(true);

    const interval = setInterval(() => {
      loadFeed(false);
    }, getCrowdMapRefreshMs());

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return state;
}
