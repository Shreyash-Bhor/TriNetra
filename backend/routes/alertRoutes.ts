import express from "express";
const router = express.Router();

router.get("/generate", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Alert route is working properly"
    });
});

export default router;