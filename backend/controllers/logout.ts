import { Request, Response } from "express";
import RefreshToken from "../models/RefreshToken";
import { ENV } from "../config/constants";
import { refreshCookieOpts } from "../utils/cookies";
import hashToken from "../utils/hash";
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[ENV.COOKIE_NAME];

  if (!refreshToken) {
    return res.status(200).json({ message: "Logged out (no token found)" });
  }

  try {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.updateOne(
      { tokenHash },
      { $set: { revokedAt: new Date() } }
    );

    res.clearCookie(ENV.COOKIE_NAME, refreshCookieOpts);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json({ message: "Logout Failed" });
  }
};
