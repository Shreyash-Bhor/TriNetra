import { z } from "zod";

export const createAlertRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  message: z.string().trim().min(5).max(500),
});

export const alertViewerSchema = z.enum(["admin", "volunteer"]);

export type CreateAlertInput = z.infer<typeof createAlertRequestSchema>;
