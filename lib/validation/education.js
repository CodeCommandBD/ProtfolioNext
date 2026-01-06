import { z } from "zod";

export const educationSchema = z.object({
  school: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  date: z.string().min(1),
  grade: z.string().max(50).optional(),
  desc: z.string().max(1000).optional(),
  image: z.string().url(),
  order: z.number().int().min(0).optional(),
});
