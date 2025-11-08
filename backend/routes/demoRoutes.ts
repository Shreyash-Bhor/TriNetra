import express from "express";
const router = express.Router();

router.get("/demo-request", (req, res) =>  {
    res.status(200).json({ 
        success: true, 
        message: "Demo route is working properly",
    });
});

export default router;