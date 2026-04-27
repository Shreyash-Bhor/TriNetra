import { z } from "zod";

export const forgotPasswordSchema = z.object({
  username: z.string().trim().min(3, "Username is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
