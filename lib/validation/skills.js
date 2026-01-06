import { z } from "zod";

export const skillItemSchema = z.object({
  name: z.string().min(1).max(50),
  image: z.string().url(),
});

export const skillSchema = z.object({
  title: z.string().min(1).max(100),
  skills: z.array(skillItemSchema).min(1, "At least one skill required"),
  order: z.number().int().min(0).optional(),
});
