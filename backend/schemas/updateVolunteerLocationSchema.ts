import { z } from "zod";
import { volunteerLocations } from "./registerUserSchema";

export const updateVolunteerLocationSchema = z.object({
  location: z.enum(volunteerLocations),
});
