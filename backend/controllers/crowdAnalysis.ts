import { Request, Response } from "express";
import { analyzeCrowdImage } from "../services/crowdAnalysisService";
import { computeDensityLevel, computeStatus } from "../utils/crowdMetrics";

type CrowdAnalysisRequestBody = {
  imageBase64?: string;
  mimeType?: string;
  fileName?: string;
  cameraId?: string;
  location?: string;
};

const getImagePayload = (body: CrowdAnalysisRequestBody) => {
  if (!body.imageBase64 || !body.mimeType) {
    return null;
  }

  const sanitizedBase64 = body.imageBase64.replace(
    /^data:image\/[a-zA-Z+.-]+;base64,/,
    "",
  );
  const buffer = Buffer.from(sanitizedBase64, "base64");

  if (buffer.length === 0) {
    return null;
  }

  return {
    buffer,
    mimeType: body.mimeType,
    fileName: body.fileName?.trim() || "crowd-image.png",
  };
};

const sendMissingImageError = (res: Response) =>
  res.status(400).json({
    message: "Please provide a valid base64 encoded image.",
  });

const handleControllerError = (res: Response, error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Internal server error";
  const statusCode = message.includes("timed out")
    ? 504
    : message.includes("ML service responded")
      ? 502
      : 500;

  console.error("Crowd analysis request failed", error);
  return res.status(statusCode).json({ message });
};

const buildResponse = (
  count: number,
  heatmap: string,
  cameraId: string | null,
  location: string | null,
) => {
  const densityLevel = computeDensityLevel(count);
  const status = computeStatus(densityLevel);

  return {
    camera_id: cameraId,
    location,
    count,
    density_level: densityLevel,
    status,
    heatmap,
    timestamp: new Date().toISOString(),
  };
};

export const analyzeUploadedImage = async (
  req: Request<unknown, unknown, CrowdAnalysisRequestBody>,
  res: Response,
) => {
  const imagePayload = getImagePayload(req.body);

  if (!imagePayload) {
    return sendMissingImageError(res);
  }

  try {
    const result = await analyzeCrowdImage(
      imagePayload.buffer,
      imagePayload.fileName,
      imagePayload.mimeType,
    );

    return res
      .status(200)
      .json(buildResponse(result.count, result.heatmap, null, null));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const analyzeCameraFrame = async (
  req: Request<unknown, unknown, CrowdAnalysisRequestBody>,
  res: Response,
) => {
  const imagePayload = getImagePayload(req.body);

  if (!imagePayload) {
    return sendMissingImageError(res);
  }

  try {
    const result = await analyzeCrowdImage(
      imagePayload.buffer,
      imagePayload.fileName,
      imagePayload.mimeType,
    );

    return res
      .status(200)
      .json(
        buildResponse(
          result.count,
          result.heatmap,
          req.body.cameraId?.trim() || null,
          req.body.location?.trim() || null,
        ),
      );
  } catch (error) {
    return handleControllerError(res, error);
  }
};
