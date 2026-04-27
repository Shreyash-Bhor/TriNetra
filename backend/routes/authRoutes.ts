import express from "express";
import { loginApp } from "../controllers/login";
import { signupApp } from "../controllers/signup";
import { forgotPasswordApp } from "../controllers/forgotPassword";

const router = express.Router();
router.post("/signup", signupApp);
router.post("/login", loginApp);
router.post("/forgot-password", forgotPasswordApp);

export default router;
