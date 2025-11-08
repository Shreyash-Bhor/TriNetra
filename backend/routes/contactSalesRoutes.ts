import express from "express";
const router = express.Router();

router.get("/request", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Contact sales route is working properly"
    });
});

export default router;