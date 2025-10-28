import express from "express";
import { loginApp } from "../controllers/login";
import { signupApp } from "../controllers/signup";

const router = express.Router();
router.post("/signup", signupApp);
router.post("/login", loginApp);

export default router;
