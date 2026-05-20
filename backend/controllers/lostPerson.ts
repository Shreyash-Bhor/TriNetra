import { Request, Response } from "express";
import { LostPersonReportModel } from "../models/LostPersonReport";
import { lostPersonRequestSchema } from "../schemas/lostPersonSchema";

export const createLostPersonReport = async (req: Request, res: Response) => {
  try {
    const payload = lostPersonRequestSchema.parse(req.body);

    const report = await LostPersonReportModel.create(payload);
    return res.status(201).json(report);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid request payload",
        errors: error.issues,
      });
    }

    console.error("Error while creating lost person report", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLostPersonReports = async (_req: Request, res: Response) => {
  try {
    const reports = await LostPersonReportModel.find().sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error while fetching lost person reports", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
