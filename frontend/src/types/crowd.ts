export type CrowdDensityLevel = "low" | "medium" | "high";

export type CrowdStatus = "normal" | "warning" | "critical";

export type CameraCrowdFeed = {
  camera_id: string;
  location: string;
  latitude: number;
  longitude: number;
  count: number;
  density_level: CrowdDensityLevel;
  status: CrowdStatus;
  heatmap: string;
  timestamp: string;
};

export type CameraFeedSimulationHealth = {
  running: boolean;
  initialized: boolean;
  camera_count: number;
  next_image_index: number;
  interval_ms: number;
};

export type LatestCameraFeedResponse = {
  data: CameraCrowdFeed[];
  simulation: CameraFeedSimulationHealth;
};
