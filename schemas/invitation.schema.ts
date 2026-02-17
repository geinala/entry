import z from "zod";

export const SendInvitationSchema = z.object({
  waitlistIds: z.array(z.number()).min(1, "At least one waitlist entry must be selected"),
});

export type TSendInvitation = z.infer<typeof SendInvitationSchema>;
