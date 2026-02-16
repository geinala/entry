import "server-only";

import { server } from "@/lib/axios";

export const sendInvitationsService = async (waitlistIds: string[]) => {
  return await server.post("/invitations", { waitlist_ids: waitlistIds });
};
