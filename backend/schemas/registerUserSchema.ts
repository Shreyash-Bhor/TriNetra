import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[@,#,$,%,^,&,*,!]/, "Must contain one symbol"),
  firstName: z.string().trim().max(10),
  lastName: z.string().trim().max(10),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  role: z.enum(["admin", "volunteer"]).default("volunteer"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
