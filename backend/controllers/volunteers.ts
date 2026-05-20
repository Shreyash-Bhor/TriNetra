import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserModel } from "../models/User";

export const fetchRegisteredVolunteers = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const volunteers = await UserModel.find({ role: "volunteer" })
      .select("username location")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ volunteers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch registered volunteers" });
  }
};
