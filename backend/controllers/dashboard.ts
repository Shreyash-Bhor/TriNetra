import { Request, Response } from "express";

export const getDashboardOverview = async (req: Request, res: Response) => {
  res.json({
    user: req.user,
    systemStatus: "Active",
    monitoredZones: 12,
    activeAlerts: 3,
  });
};

export const getCrowdStats = async (req: Request, res: Response) => {
  res.json({
    estimatedCrowdCount: 3240,
    densityLevel: "High",
    heatmapAvailable: true,
  });
};

export const getAlerts = async (req: Request, res: Response) => {
  res.json({
    alerts: [
      { zone: "Ramkund", level: "High", status: "Active" },
      { zone: "Panchavati", level: "Medium", status: "Resolved" },
    ],
  });
};
