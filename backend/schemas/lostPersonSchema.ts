import { z } from "zod";

export const lostPersonSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  age: z.number().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
});

export const lostPersonRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
});

export type LostPersonInput = z.infer<typeof lostPersonSchema>;
