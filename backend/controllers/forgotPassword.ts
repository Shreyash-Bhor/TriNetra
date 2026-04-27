import { Request, Response } from "express";
import { ZodError } from "zod";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { resetPasswordByUsername } from "../services/passwordResetService";

export const forgotPasswordApp = async (req: Request, res: Response) => {
  try {
    const { username, newPassword } = forgotPasswordSchema.parse(req.body);

    const updated = await resetPasswordByUsername(username, newPassword);

    if (!updated) {
      return res.status(404).json({
        message: "No user found with the provided username",
      });
    }

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error: any) {
    console.error("Forgot password error: ", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Invalid request",
      });
    }

    return res.status(500).json({
      message: error.message || "Unable to reset password",
    });
  }
};
