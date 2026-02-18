import "server-only";

import { server } from "@/lib/axios";
import { updateWaitlistEntriesStatusRepository } from "../waitlist/waitlist.repository";

export const sendInvitationsService = async (waitlistIds: number[]) => {
  try {
    await updateWaitlistEntriesStatusRepository({ waitlistIds, status: "sending" });

    return await server.post("/invitations", { waitlist_ids: waitlistIds });
  } catch (error) {
    throw error;
  }
};
