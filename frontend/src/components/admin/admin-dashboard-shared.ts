import { ComponentType } from "react";
import { CameraCrowdFeed } from "@/types/crowd";
import { LostPersonReport } from "@/types/lostPerson";
import { SiteAlert } from "@/types/alert";

export const glassCardClass =
  "glass-strong rounded-3xl border border-slate-300/80 shadow-2xl shadow-black/10 dark:border-white/15";

export const moduleHeightClass = "h-[30rem]";
export const compactModuleHeightClass = "h-[10rem]";

export type RegisteredVolunteer = {
  _id: string;
  username: string;
  firstName: string;
  lastName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboardData = {
  reports: LostPersonReport[];
  alerts: SiteAlert[];
  volunteers: RegisteredVolunteer[];
};

export type AdminKpiCard = {
  key: string;
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  toneClass: string;
};

export const EXPECTED_CAMERAS = ["CAM_01", "CAM_02", "CAM_03"];

export const normalizeCameraFeeds = (feeds: CameraCrowdFeed[]) =>
  feeds.map((feed) => ({ ...feed, count: Math.round(feed.count) }));
