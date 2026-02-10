import z from "zod";

export const WaitlistFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be at most 100 characters long"),
});

export type WaitlistFormType = z.infer<typeof WaitlistFormSchema>;
