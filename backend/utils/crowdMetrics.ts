export type DensityLevel = "LOW" | "MEDIUM" | "HIGH";
export type CrowdStatus = "NORMAL" | "WARNING" | "CRITICAL";

const mediumThreshold = Number(process.env.CROWD_MEDIUM_THRESHOLD ?? 30);
const highThreshold = Number(process.env.CROWD_HIGH_THRESHOLD ?? 75);

export const computeDensityLevel = (count: number): DensityLevel => {
  if (count >= highThreshold) {
    return "HIGH";
  }

  if (count >= mediumThreshold) {
    return "MEDIUM";
  }

  return "LOW";
};

export const computeStatus = (densityLevel: DensityLevel): CrowdStatus => {
  if (densityLevel === "HIGH") {
    return "CRITICAL";
  }

  if (densityLevel === "MEDIUM") {
    return "WARNING";
  }

  return "NORMAL";
};
