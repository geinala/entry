import z from "zod";

export const SendAndRevokeInvitationSchema = z.object({
  waitlistIds: z.array(z.number()).min(1, "At least one waitlist entry must be selected"),
});

export type TSendAndRevokeInvitation = z.infer<typeof SendAndRevokeInvitationSchema>;
