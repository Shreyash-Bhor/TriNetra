import { Request, Response } from "express";
import { LostPersonReportModel } from "../models/LostPersonReport";
import { lostPersonRequestSchema } from "../schemas/lostPersonSchema";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserModel } from "../models/User";

export const createLostPersonReport = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = lostPersonRequestSchema.parse(req.body);

    const report = await LostPersonReportModel.create({
      ...payload,
      createdBy: req.user.id,
    });
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
    const reports = await LostPersonReportModel.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username")
      .populate("dismissedBy", "username");
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error while fetching lost person reports", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const dismissLostPersonReport = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const report = await LostPersonReportModel.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Lost person report not found" });
    }

    if (report.isDismissed) {
      return res.status(200).json(report);
    }

    const user = await UserModel.findById(req.user.id).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    report.isDismissed = true;
    report.dismissedAt = new Date();
    report.dismissedBy = user._id;
    await report.save();

    const hydratedReport = await LostPersonReportModel.findById(report._id)
      .populate("createdBy", "username")
      .populate("dismissedBy", "username");

    return res.status(200).json(hydratedReport);
  } catch (error) {
    console.error("Error while dismissing lost person report", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
