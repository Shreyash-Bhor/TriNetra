import express, { Request, Response } from "express";
import { LostPersonReportModel } from "../models/LostPersonReport";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { fullName, age, gender } = req.body;

    if (!fullName || age === undefined || !gender) {
      return res
        .status(400)
        .json({ message: "fullName, age and gender are required" });
    }

    const numericAge = Number(age);
    if (Number.isNaN(numericAge) || numericAge < 0 || numericAge > 120) {
      return res.status(400).json({ message: "age must be between 0 and 120" });
    }

    if (!["male", "female", "other"].includes(gender)) {
      return res
        .status(400)
        .json({ message: "gender must be one of: male, female, other" });
    }

    const report = await LostPersonReportModel.create({
      fullName: String(fullName).trim(),
      age: numericAge,
      gender,
    });

    return res.status(201).json(report);
  } catch (error) {
    console.error("Error while creating lost person report", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const reports = await LostPersonReportModel.find().sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error while fetching lost person reports", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
