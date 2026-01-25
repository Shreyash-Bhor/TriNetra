import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getWeatherForecast } from "../controllers/weather";

const router = Router();

router.get("/", requireAuth, getWeatherForecast);

export default router;
