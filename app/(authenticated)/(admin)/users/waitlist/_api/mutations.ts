import { TAuthenticatedClient } from "@/app/_hooks/use-authenticated-client";
import { TSendInvitation } from "@/schemas/invitation.schema";
import { mutationOptions } from "@tanstack/react-query";

export const waitlistMutations = {
  send: (api: TAuthenticatedClient) => {
    return mutationOptions({
      mutationFn: async (payload: TSendInvitation) => {
        return await api.post("/invitations", { waitlistIds: payload.waitlistIds });
      },
    });
  },
};
