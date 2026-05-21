import { Response } from "express";
import { AlertModel } from "../models/Alert";
import {
  alertViewerSchema,
  createAlertRequestSchema,
} from "../schemas/alertSchema";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createAlert = async (req: AuthRequest, res: Response) => {
  try {
    const payload = createAlertRequestSchema.parse(req.body);
    const createdByRole = req.user?.role;

    if (!createdByRole) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const status = createdByRole === "admin" ? "active" : "pending";
    const acknowledgedAt = status === "active" ? new Date() : undefined;

    const alert = await AlertModel.create({
      ...payload,
      createdByRole,
      status,
      acknowledgedAt,
    });

    return res.status(201).json(alert);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid request payload",
        errors: error.issues,
      });
    }

    console.error("Error while creating alert", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const viewer = alertViewerSchema.parse(req.user?.role);

    const query = viewer === "admin" ? {} : { status: "active" };
    const alerts = await AlertModel.find(query).sort({ createdAt: -1 });

    return res.status(200).json(alerts);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid request query",
        errors: error.issues,
      });
    }

    console.error("Error while fetching alerts", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acknowledgeAlert = async (req: AuthRequest, res: Response) => {
  try {
    const alert = await AlertModel.findByIdAndUpdate(
      req.params.id,
      { status: "active", acknowledgedAt: new Date(), dismissedAt: undefined },
      { new: true },
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    return res.status(200).json(alert);
  } catch (error) {
    console.error("Error while acknowledging alert", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const dismissAlert = async (req: AuthRequest, res: Response) => {
  try {
    const alert = await AlertModel.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    return res.status(200).json({
      message: "Alert dismissed and deleted",
      alert,
    });
  } catch (error) {
    console.error("Error while dismissing alert", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
