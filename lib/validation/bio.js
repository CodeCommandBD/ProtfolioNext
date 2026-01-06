import { z } from "zod";

export const bioSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  roles: z.array(z.string().min(1)).min(1, "At least one role required"),
  description: z.string().min(10).max(1000),
  github: z.string().url().optional().or(z.literal("")),
  resume: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  insta: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  profileImage: z.string().url().optional().or(z.literal("")),
});
