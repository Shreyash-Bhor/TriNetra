import express from "express";
import { refresh } from "../controllers/refresh";

const router = express.Router();

router.post("/refresh", refresh);

export default router;
