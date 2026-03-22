import express from "express";
import {
  analyzeCameraFrame,
  analyzeUploadedImage,
} from "../controllers/crowdAnalysis";

const router = express.Router();

router.post("/analyze/upload", analyzeUploadedImage);
router.post("/analyze/camera-frame", analyzeCameraFrame);

export default router;
