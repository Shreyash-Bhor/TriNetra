import express from "express";
const router = express.Router();

router.get("/states", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Dashboard route is working properly"
    });
});

export default router;