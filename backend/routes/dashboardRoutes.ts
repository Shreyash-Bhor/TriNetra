import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import {
  getDashboardOverview,
  getCrowdStats,
  getAlerts
} from "../controllers/dashboard";

const router = Router();

// Common dashboard (all logged-in users)
router.get("/overview", requireAuth, getDashboardOverview);

// Crowd data (admin & volunteer)
router.get(
  "/crowd",
  requireAuth,
  requireRole("volunteer"),
  getCrowdStats
);

// Alerts (admin only)
router.get(
  "/alerts",
  requireAuth,
  requireRole("admin"),
  getAlerts
);

export default router;
