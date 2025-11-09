import { Request, Response } from "express";
import bcrypt from "bcrypt";
import hashToken from "../utils/hash";
import { loginUserSchema } from "../schemas/loginUserSchema";
import { UserModel } from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { refreshCookieOpts } from "../utils/cookies";
import { ENV } from "../config/constants";
import { generateTokens } from "../utils/generateTokens";

export const loginApp = async (req: Request, res: Response) => {
  try {
    const data = loginUserSchema.parse(req.body);
    const { email, password } = data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshCookieOpts.maxAge),
      userAgent: req.headers["user-agent"],
      ip:
        (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
    });

    res.cookie(ENV.COOKIE_NAME, refreshToken, refreshCookieOpts);
    return res.status(200).json({
      message: "Login Successfull",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error: ", error);
    return res.status(500).json({ message: error.message });
  }
};
