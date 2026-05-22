import { Request, Response } from "express";
import { cameraFeedSimulatorService } from "../services/cameraFeedSimulatorService";
import { UserModel } from "../models/User";
export const getLatestSimulatedCameraFeed = (_req: Request, res: Response) => {
  return res.status(200).json({
    data: cameraFeedSimulatorService.getLatestResults(),
    simulation: cameraFeedSimulatorService.getHealth(),
  });
};

export const getSimulationHealth = (_req: Request, res: Response) => {
  return res.status(200).json(cameraFeedSimulatorService.getHealth());
};

export const getVolunteerDashboardKpis = async (
  _req: Request,
  res: Response,
) => {
  const latestResults = cameraFeedSimulatorService.getLatestResults();
  const totalCrowdCount = latestResults.reduce(
    (sum, camera) => sum + camera.count,
    0,
  );
  const totalRegisteredVolunteers = await UserModel.countDocuments({
    role: "volunteer",
  });
  const lifetimePeak = cameraFeedSimulatorService.getLifetimePeak();

  return res.status(200).json({
    totalCrowdCount,
    totalRegisteredVolunteers,
    highestDensityZone: lifetimePeak.location,
  });
};
