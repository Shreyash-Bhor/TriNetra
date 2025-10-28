import express from "express";
const router = express.Router();

router.get("/crowd/info");
router.post("/crowd/add");

export default router;
