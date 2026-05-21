"use client";

import { useCallback, useEffect, useState } from "react";
import { RealtimeTopic, subscribeRealtimeUpdate } from "@/lib/realtime";

type UseLiveResourceOptions<T> = {
  topic: RealtimeTopic;
  fetcher: () => Promise<T>;
  pollingMs?: number;
  onError?: () => void;
};

export const useLiveResource = <T>({
  topic,
  fetcher,
  pollingMs = 5000,
  onError,
}: UseLiveResourceOptions<T>) => {
  const [data, setData] = useState<T | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetcher();
      setData(next);
    } catch {
      onError?.();
    }
  }, [fetcher, onError]);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, pollingMs);
    const unsubscribe = subscribeRealtimeUpdate(topic, refresh);

    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, [pollingMs, refresh, topic]);

  return { data, refresh, setData };
};
