import fs from "node:fs/promises";
import path from "node:path";
import { analyzeCrowdImage } from "./crowdAnalysisService";
import {
  computeDensityLevel,
  computeStatus,
  type CrowdStatus,
  type DensityLevel,
} from "../utils/crowdMetrics";
import { alertAutomationService } from "./alertAutomationService";
export type CameraMetadata = {
  camera_id: string;
  location: string;
  latitude: number;
  longitude: number;
};

export type CameraFeedResult = CameraMetadata & {
  count: number;
  density_level: DensityLevel;
  status: CrowdStatus;
  heatmap: string;
  timestamp: string;
};

type CameraState = {
  metadata: CameraMetadata;
  folderPath: string;
  images: string[];
};

const CAMERAS_ROOT = path.resolve(__dirname, "../../cameras");
const CAMERA_CAPTURE_INTERVAL_MS = Number(
  process.env.CAMERA_CAPTURE_INTERVAL_MS ?? 10_000,
);

const cameraConfigs: Array<{ folderName: string; metadata: CameraMetadata }> = [
  {
    folderName: "cam_01",
    metadata: {
      camera_id: "CAM_01",
      location: "Ramkund",
      latitude: 20.0082,
      longitude: 73.7917,
    },
  },
  {
    folderName: "cam_02",
    metadata: {
      camera_id: "CAM_02",
      location: "Kalaram Temple",
      latitude: 20.007,
      longitude: 73.7888,
    },
  },
  {
    folderName: "cam_03",
    metadata: {
      camera_id: "CAM_03",
      location: "Panchavati Market",
      latitude: 20.0065,
      longitude: 73.796,
    },
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getMimeTypeFromName = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  }

  return "image/png";
};

class CameraFeedSimulatorService {
  private isInitialized = false;
  private isRunning = false;
  private isLoopActive = false;
  private cameraStates: CameraState[] = [];
  private latestResults = new Map<string, CameraFeedResult>();
  private nextImageIndex = 0;
  private totalImageSlots = 0;

  async start() {
    if (this.isRunning) {
      return;
    }

    await this.ensureInitialized();
    this.isRunning = true;
    this.runLoop().catch((error) => {
      console.error("Camera feed simulation loop failed", error);
      this.isLoopActive = false;
    });
  }

  stop() {
    this.isRunning = false;
  }

  getLatestResults(): CameraFeedResult[] {
    return cameraConfigs
      .map((entry) => this.latestResults.get(entry.metadata.camera_id))
      .filter((entry): entry is CameraFeedResult => Boolean(entry));
  }

  getHealth() {
    return {
      running: this.isRunning,
      initialized: this.isInitialized,
      camera_count: this.cameraStates.length,
      next_image_index: this.nextImageIndex + 1,
      interval_ms: CAMERA_CAPTURE_INTERVAL_MS,
    };
  }

  private async ensureInitialized() {
    if (this.isInitialized) {
      return;
    }

    const states: CameraState[] = [];

    for (const camera of cameraConfigs) {
      const folderPath = path.join(CAMERAS_ROOT, camera.folderName);
      const directoryEntries = await fs.readdir(folderPath);
      const imageNames = directoryEntries
        .filter((name) => /\.(png|jpg|jpeg)$/i.test(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      if (imageNames.length === 0) {
        throw new Error(`No images found in ${folderPath}`);
      }

      states.push({
        metadata: camera.metadata,
        folderPath,
        images: imageNames,
      });
    }

    this.cameraStates = states;
    this.totalImageSlots = Math.max(
      ...states.map((state) => state.images.length),
    );
    this.isInitialized = true;
  }

  private async runLoop() {
    if (this.isLoopActive) {
      return;
    }

    this.isLoopActive = true;

    while (this.isRunning) {
      for (const cameraState of this.cameraStates) {
        if (!this.isRunning) {
          break;
        }

        const imageName =
          cameraState.images[this.nextImageIndex % cameraState.images.length];
        const imagePath = path.join(cameraState.folderPath, imageName);

        try {
          const imageBuffer = await fs.readFile(imagePath);
          const inference = await analyzeCrowdImage(
            imageBuffer,
            imageName,
            getMimeTypeFromName(imageName),
          );

          const densityLevel = computeDensityLevel(inference.count);
          const status = computeStatus(densityLevel);
          if (densityLevel === "HIGH") {
            await alertAutomationService.ensureHighDensityAlert({
              cameraId: cameraState.metadata.camera_id,
              location: cameraState.metadata.location,
            });
          }

          this.latestResults.set(cameraState.metadata.camera_id, {
            ...cameraState.metadata,
            count: inference.count,
            density_level: densityLevel,
            status,
            heatmap: inference.heatmap,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error(
            `Failed to process frame ${cameraState.metadata.camera_id}/${imageName}`,
            error,
          );
        }

        if (!this.isRunning) {
          break;
        }

        await delay(CAMERA_CAPTURE_INTERVAL_MS);
      }

      this.nextImageIndex =
        (this.nextImageIndex + 1) % Math.max(1, this.totalImageSlots);
    }

    this.isLoopActive = false;
  }
}

export const cameraFeedSimulatorService = new CameraFeedSimulatorService();
