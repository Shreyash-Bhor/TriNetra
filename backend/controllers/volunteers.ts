import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserModel } from "../models/User";
import { updateVolunteerLocationSchema } from "../schemas/updateVolunteerLocationSchema";
export const fetchRegisteredVolunteers = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const volunteers = await UserModel.find({ role: "volunteer" })
      .select("username firstName lastName location createdAt updatedAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({ volunteers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch registered volunteers" });
  }
};
export const updateVolunteerLocation = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { location } = updateVolunteerLocationSchema.parse(req.body);

    const updatedVolunteer = await UserModel.findOneAndUpdate(
      { _id: req.user.id, role: "volunteer" },
      { location },
      { new: true },
    )
      .select("username role location")
      .lean();

    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      volunteer: updatedVolunteer,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Failed to update volunteer location",
    });
  }
};
