import { z } from "zod";

export const createInquirySchema = z.object({
  propertyId: z.string().min(1, "Property is required."),
  senderName: z.string().trim().min(1, "Enter your name."),
  senderEmail: z.email("Enter a valid email address."),
  senderPhone: z.string().trim().min(1).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be at most 1000 characters."),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
