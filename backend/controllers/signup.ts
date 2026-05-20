import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerUserSchema } from "../schemas/registerUserSchema";
import { UserModel } from "../models/User";
import { generateTokens } from "../utils/generateTokens";
import RefreshToken from "../models/RefreshToken";
import hashToken from "../utils/hash";
import { refreshCookieOpts } from "../utils/cookies";
import { ENV } from "../config/constants";

export const signupApp = async (req: Request, res: Response) => {
  try {
    const data = registerUserSchema.parse(req.body);
    const { username, email, password, firstName, lastName, role } = data;
    const user_mail = await UserModel.findOne({ email });
    if (user_mail) {
      return res.status(401).json({ message: "Mail Already exist" });
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hashedpass,
      firstName,
      lastName,
      role: role || "volunteer",
    });
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
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error: ", error);
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
};
