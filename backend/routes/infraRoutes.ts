import express from "express";
const router = express.Router();

router.get("/infra", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Infrastructure route is working properly"
    });
});

export default router;