export type CrowdDensityLevel = "low" | "medium" | "high";

export type CrowdStatus = "normal" | "warning" | "critical";

export interface CrowdAnalysisResult {
  camera_id: string | null;
  location: string | null;
  count: number;
  density_level: CrowdDensityLevel;
  status: CrowdStatus;
  heatmap: string;
  timestamp: string;
}

export interface CameraFeedResponse {
  data: CrowdAnalysisResult[];
  simulation: {
    running: boolean;
    configuredCameraCount: number;
    resultsAvailable: number;
    intervalMs: number;
    mlServiceUrl: string;
    mlTimeoutMs: number;
    initializedAt: string;
    lastUpdatedAt: string;
  };
}
