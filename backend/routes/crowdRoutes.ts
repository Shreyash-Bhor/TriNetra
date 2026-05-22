import express from "express";
import {
  analyzeCameraFrame,
  analyzeUploadedImage,
} from "../controllers/crowdAnalysis";
import {
  getLatestSimulatedCameraFeed,
  getVolunteerDashboardKpis,
  getSimulationHealth,
} from "../controllers/cameraFeedSimulation";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/analyze/upload",
  requireAuth,
  requireRole("admin"),
  analyzeUploadedImage,
);
router.post(
  "/analyze/camera-frame",
  requireAuth,
  requireRole("admin"),
  analyzeCameraFrame,
);
router.get(
  "/simulation/latest",
  requireAuth,
  requireRole("volunteer", "admin"),
  getLatestSimulatedCameraFeed,
);
router.get("/simulation/public-latest", getLatestSimulatedCameraFeed);
router.get(
  "/simulation/volunteer-kpis",
  requireAuth,
  requireRole("volunteer", "admin"),
  getVolunteerDashboardKpis,
);
router.get(
  "/simulation/health",
  requireAuth,
  requireRole("admin"),
  getSimulationHealth,
);

export default router;
