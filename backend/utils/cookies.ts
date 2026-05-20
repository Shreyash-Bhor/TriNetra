import { ENV } from "../config/constants";
export const refreshCookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  path: "/", // Cookie only sent to refresh endpoint
  maxAge: ENV.JWT_REFRESH_EXPIRES.endsWith("d")
    ? parseInt(ENV.JWT_REFRESH_EXPIRES) * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000, // default 7d
};
