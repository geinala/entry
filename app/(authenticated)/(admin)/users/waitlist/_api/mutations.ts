import { TSendInvitation } from "@/schemas/invitation.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { toast } from "sonner";
import { WAITLIST_QUERY_KEYS } from "./queries";

export const waitlistMutations = {
  send: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (payload: TSendInvitation) => {
        return await api.post("/invitations", { waitlistIds: payload.waitlistIds });
      },
      onSuccess: (_, payload) => {
        toast.success(`Invitations sent to ${payload.waitlistIds.length} user(s)`);

        queryClient.invalidateQueries({ queryKey: WAITLIST_QUERY_KEYS.list });
      },
    });
  },
};
