import express from "express";
import {
  createLostPersonReport,
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
router.get(
  "/",
  requireAuth,
  requireRole("volunteer", "admin"),
  getLostPersonReports,
);

export default router;
