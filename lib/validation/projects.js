import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().min(1),
  description: z.string().min(10).max(2000),
  image: z.string().url(),
  tags: z.array(z.string()).min(1),
  category: z.string().min(1),
  github: z.string().url().optional().or(z.literal("")),
  webapp: z.string().url().optional().or(z.literal("")),
  member: z.array(z.string()).optional(),
  order: z.number().int().min(0).optional(),
});
