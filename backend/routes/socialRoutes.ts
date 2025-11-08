import express from "express";
const router = express.Router();

router.get("/email", (req, res) => {
  res.status(200).json({
    success: true,
    message: "email link route is working properly",
  });
});

router.get("/twitter", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Twitter (X) link route is working properly",
  });
});

router.get("/linkedin", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LinkedIn link route is working properly",
  });
});

router.get("/github", (req, res) => {
  res.status(200).json({
    success: true,
    message: "github link route is working properly",
  });
});

export default router;
