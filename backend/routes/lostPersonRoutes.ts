import express from "express";
import {
  createLostPersonReport,
  getLostPersonReports,
} from "../controllers/lostPerson";

const router = express.Router();

router.post("/", createLostPersonReport);
router.get("/", getLostPersonReports);

export default router;
