import express from "express";
import { loginApp } from "../controllers/login";
import { signupApp } from "../controllers/signup";
import { forgotPasswordApp } from "../controllers/forgotPassword";
import { fetchRegisteredVolunteers } from "../controllers/volunteers";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
const router = express.Router();
router.post("/signup", signupApp);
router.post("/login", loginApp);
router.post("/forgot-password", forgotPasswordApp);
router.get(
  "/volunteers",
  requireAuth,
  requireRole("admin"),
  fetchRegisteredVolunteers,
);
export default router;
