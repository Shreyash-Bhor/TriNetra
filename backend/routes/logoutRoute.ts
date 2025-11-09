import express from "express";
import { logout } from "../controllers/logout";
const router = express.Router();

router.post("/logout", logout);

export default router;
