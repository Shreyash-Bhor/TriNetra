import { z } from "zod";
const volunteerLocations = [
  "Ramkund",
  "Kalaram_Temple",
  "Panchavati_Market",
] as const;

export const registerUserSchema = z
  .object({
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
    role: z.enum(["admin", "volunteer"]).default("volunteer"),
    location: z.enum(volunteerLocations).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "volunteer" && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required for volunteers",
        path: ["location"],
      });
    }
  });

export { volunteerLocations };

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
