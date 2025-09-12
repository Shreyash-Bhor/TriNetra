import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.email(),
});

export const validateOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, "OTP Must be 6 digits"),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type ValidateOtpInput = z.infer<typeof validateOtpSchema>;
