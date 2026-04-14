import api from "@/lib/axios";
import { CameraFeedResponse, CrowdAnalysisResult } from "@/types/crowdAnalysis";

const fileToBase64 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read file as base64 string."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Failed to read selected file."));
    reader.readAsDataURL(file);
  });

export const analyzeUploadedImage = async (
  file: File,
): Promise<CrowdAnalysisResult> => {
  const imageBase64 = await fileToBase64(file);

  const response = await api.post<CrowdAnalysisResult>(
    "/crowd/analyze/upload",
    {
      imageBase64,
      mimeType: file.type || "image/png",
      fileName: file.name || "upload.png",
    },
  );

  return response.data;
};

export const analyzeCameraFrame = async (
  file: File,
  cameraId?: string,
  location?: string,
): Promise<CrowdAnalysisResult> => {
  const imageBase64 = await fileToBase64(file);

  const response = await api.post<CrowdAnalysisResult>(
    "/crowd/analyze/camera-frame",
    {
      imageBase64,
      mimeType: file.type || "image/png",
      fileName: file.name || "camera-frame.png",
      cameraId,
      location,
    },
  );

  return response.data;
};

export const fetchLiveCameraFeed = async (): Promise<CameraFeedResponse> => {
  const response = await api.get<CameraFeedResponse>("/crowd/live-feed");
  return response.data;
};
