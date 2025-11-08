import express from "express";
const router = express.Router();

router.get("/density", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Crowd density route is working properly"
    });
});

export default router;  