export type DensityLevel = "LOW" | "MEDIUM" | "HIGH";

export type CrowdAnalysisResult = {
  count: number;
  heatmap: string;
  densityLevel: DensityLevel;
};

const normalizeHeatmap = (heatmap: unknown): string => {
  if (typeof heatmap !== "string" || heatmap.trim().length === 0) {
    throw new Error("Heatmap was missing from the ML service response");
  }

  if (heatmap.startsWith("data:image")) {
    return heatmap;
  }

  return `data:image/png;base64,${heatmap}`;
};

const normalizeDensityLevel = (densityLevel: unknown): DensityLevel => {
  if (typeof densityLevel !== "string") {
    throw new Error("Density level was missing from the ML service response");
  }

  const normalized = densityLevel.toUpperCase();
  if (!["LOW", "MEDIUM", "HIGH"].includes(normalized)) {
    throw new Error(`Unsupported density level received: ${densityLevel}`);
  }

  return normalized as DensityLevel;
};

export const analyzeCrowdImage = async (
  imageBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<CrowdAnalysisResult> => {
  const serviceUrl =
    process.env.ML_SERVICE_URL ?? "http://127.0.0.1:8000/predict";
  const timeoutMs = Number(process.env.ML_SERVICE_TIMEOUT_MS ?? 10000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formData = new FormData();
    const imageBlob = new Blob([new Uint8Array(imageBuffer)], {
      type: mimeType,
    });
    formData.append("file", imageBlob, fileName);

    const response = await fetch(serviceUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ML service responded with ${response.status}${errorText ? `: ${errorText}` : ""}`,
      );
    }

    const data = (await response.json()) as {
      count?: unknown;
      heatmap?: unknown;
      density_level?: unknown;
    };

    if (typeof data.count !== "number" || Number.isNaN(data.count)) {
      throw new Error("Count was missing from the ML service response");
    }

    return {
      count: data.count,
      heatmap: normalizeHeatmap(data.heatmap),
      densityLevel: normalizeDensityLevel(data.density_level),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The ML service timed out while processing the image");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
