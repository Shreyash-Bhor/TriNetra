import { Request, Response } from "express";
import { cameraFeedSimulatorService } from "../services/cameraFeedSimulatorService";

export const getLatestSimulatedCameraFeed = (_req: Request, res: Response) => {
  return res.status(200).json({
    data: cameraFeedSimulatorService.getLatestResults(),
    simulation: cameraFeedSimulatorService.getHealth(),
  });
};

export const getSimulationHealth = (_req: Request, res: Response) => {
  return res.status(200).json(cameraFeedSimulatorService.getHealth());
};
