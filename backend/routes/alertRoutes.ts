import express from "express";
import {
  acknowledgeAlert,
  createAlert,
  getAlerts,
  dismissAlert,
} from "../controllers/alert";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/", requireAuth, requireRole("volunteer", "admin"), createAlert);
router.get("/", requireAuth, requireRole("volunteer", "admin"), getAlerts);
router.patch(
  "/:id/acknowledge",
  requireAuth,
  requireRole("admin"),
  acknowledgeAlert,
);
router.patch("/:id/dismiss", requireAuth, requireRole("admin"), dismissAlert);
export default router;
