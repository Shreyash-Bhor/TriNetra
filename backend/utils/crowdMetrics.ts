export type DensityLevel = "LOW" | "MEDIUM" | "HIGH";
export type CrowdStatus = "NORMAL" | "MEDIUM" | "CRITICAL";

const mediumThreshold = Number(process.env.CROWD_MEDIUM_THRESHOLD ?? 700);
const highThreshold = Number(process.env.CROWD_HIGH_THRESHOLD ?? 2000);

export const computeDensityLevel = (count: number): DensityLevel => {
  if (count > highThreshold) {
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
    return "MEDIUM";
  }

  return "NORMAL";
};
