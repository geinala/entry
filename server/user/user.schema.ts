import { z } from "zod";

export const OnBoardingUserSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  clerkUserId: z.string().nonempty("Clerk user ID is required"),
});

export type OnBoardingUserData = z.infer<typeof OnBoardingUserSchema>;
