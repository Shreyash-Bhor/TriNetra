import { AlertModel } from "../models/Alert";

type CameraAlertPayload = {
  cameraId: string;
  location: string;
};

const buildAlertTitle = (location: string) =>
  `High Crowd Density - ${location}`;

const buildAlertMessage = (location: string) =>
  `High crowd density detected at ${location}. Immediate attention required.`;

class AlertAutomationService {
  async ensureHighDensityAlert({ cameraId, location }: CameraAlertPayload) {
    const existingAlert = await AlertModel.findOne({
      sourceCameraId: cameraId,
    });

    if (existingAlert) {
      return existingAlert;
    }

    return AlertModel.create({
      title: buildAlertTitle(location),
      message: buildAlertMessage(location),
      createdByRole: "admin",
      status: "active",
      acknowledgedAt: new Date(),
      sourceCameraId: cameraId,
      sourceLocation: location,
    });
  }
}

export const alertAutomationService = new AlertAutomationService();
