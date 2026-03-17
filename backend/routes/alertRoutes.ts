import express from "express";
import { acknowledgeAlert, createAlert, getAlerts } from "../controllers/alert";

const router = express.Router();

router.post("/", createAlert);
router.get("/", getAlerts);
router.patch("/:id/acknowledge", acknowledgeAlert);

export default router;
