import express from "express";
import {
  analyzeCameraFrame,
  analyzeUploadedImage,
} from "../controllers/crowdAnalysis";
import {
  getLatestSimulatedCameraFeed,
  getSimulationHealth,
} from "../controllers/cameraFeedSimulation";

const router = express.Router();

router.post("/analyze/upload", analyzeUploadedImage);
router.post("/analyze/camera-frame", analyzeCameraFrame);
router.get("/simulation/latest", getLatestSimulatedCameraFeed);
router.get("/simulation/health", getSimulationHealth);

export default router;
