import api from "@/lib/axios";
import { CameraCrowdFeed, LatestCameraFeedResponse } from "@/types/crowd";

export const DEFAULT_CROWD_MAP_REFRESH_MS = 8000;

export const getCrowdMapRefreshMs = () => {
  const value = Number(process.env.NEXT_PUBLIC_CROWD_MAP_REFRESH_MS);

  if (!Number.isFinite(value) || value < 1000) {
    return DEFAULT_CROWD_MAP_REFRESH_MS;
  }

  return value;
};

export const fetchLatestCameraFeed = async (): Promise<CameraCrowdFeed[]> => {
  const response = await api.get<LatestCameraFeedResponse>(
    "/crowd/simulation/latest",
  );

  return response.data.data;
};
