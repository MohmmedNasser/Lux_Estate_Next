import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name.").optional(),
  phone: z.string().trim().min(1).optional(),
  image: z.url("Enter a valid image URL.").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
