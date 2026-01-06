import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  date: z.string().min(1),
  desc: z.string().max(2000).optional(),
  skills: z.array(z.string()).optional(),
  doc: z.string().url().optional().or(z.literal("")),
  image: z.string().url(),
  order: z.number().int().min(0).optional(),
});
