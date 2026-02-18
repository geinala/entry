import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";
import { waitlistStatusEnum } from "@/drizzle/schema";

export const WaitlistFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type TWaitlistForm = z.infer<typeof WaitlistFormSchema>;

export const GetWaitlistQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["firstName", "lastName", "email"]),
  status: z.enum(waitlistStatusEnum.enumValues).optional().default("pending"),
});

export type TGetWaitlistQueryParams = z.infer<typeof GetWaitlistQueryParams>;

// For updating waitlist data
export const UpdateWaitlistSchema = z.object({
  waitlistIds: z.array(z.number()).min(1, "At least one waitlist ID is required"),
  status: z.enum(waitlistStatusEnum.enumValues),
});

export type TUpdateWaitlist = z.infer<typeof UpdateWaitlistSchema>;
