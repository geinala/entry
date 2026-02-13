import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";
import { waitlistStatusEnum } from "@/drizzle/schema";

export const WaitlistFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be at most 100 characters long"),
});

export type TWaitlistForm = z.infer<typeof WaitlistFormSchema>;

export const GetWaitlistQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["fullName", "email"]),
  status: z.enum(waitlistStatusEnum.enumValues).optional(),
});

export type TGetWaitlistQueryParams = z.infer<typeof GetWaitlistQueryParams>;
