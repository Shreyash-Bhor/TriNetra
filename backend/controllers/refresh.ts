import { Request, Response } from "express";
import { verifyRefreshToken } from "../utils/jwt";
import RefreshToken from "../models/RefreshToken";
import { ENV } from "../config/constants";
import hashToken from "../utils/hash";
import { refreshCookieOpts } from "../utils/cookies";
import { generateTokens } from "../utils/generateTokens";

export async function refresh(req: Request, res: Response) {
  const refreshTokenRaw = req.cookies?.[ENV.COOKIE_NAME];
  if (!refreshTokenRaw) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const payload = verifyRefreshToken(refreshTokenRaw);
    const tokenHash = hashToken(refreshTokenRaw);
    const tokenDoc = await RefreshToken.findOne({
      user: payload.sub,
      tokenHash,
    });

    if (!tokenDoc || !tokenDoc.isActive) {
      await RefreshToken.updateMany(
        { user: payload.sub },
        { $set: { revokedAt: new Date() } }
      );
      return res
        .status(401)
        .json({ message: "Invalid or reused refresh token" });
    }

    tokenDoc.revokedAt = new Date();
    tokenDoc.save();

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    const { accessToken, refreshToken } = generateTokens(newPayload);

    await RefreshToken.create({
      user: payload.sub,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshCookieOpts.maxAge),
      userAgent: req.headers["user-agent"],
      ip:
        (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
      replacedByTokenId: tokenDoc._id,
    });

    res
      .cookie(ENV.COOKIE_NAME, refreshToken, refreshCookieOpts)
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh tokens" });
  }
}
