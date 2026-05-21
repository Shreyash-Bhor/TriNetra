import express from "express";
import {
  createLostPersonReport,
  dismissLostPersonReport,
  getLostPersonReports,
} from "../controllers/lostPerson";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("volunteer", "admin"),
  createLostPersonReport,
);
router.get("/", getLostPersonReports);
router.patch(
  "/:id/dismiss",
  requireAuth,
  requireRole("volunteer", "admin"),
  dismissLostPersonReport,
);

export default router;
