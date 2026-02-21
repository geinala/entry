import { TSendAndRevokeInvitation } from "@/schemas/invitation.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { toast } from "sonner";
import { WAITLIST_QUERY_KEYS } from "./queries";
import { TUpdateWaitlist } from "@/schemas/waitlist.schema";

export const waitlistMutations = {
  send: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (payload: TSendAndRevokeInvitation) => {
        return await api.post("/invitations", { waitlistIds: payload.waitlistIds });
      },
      onSuccess: (_, payload) => {
        toast.success(`Invitations sent to ${payload.waitlistIds.length} user(s)`);

        queryClient.invalidateQueries({ queryKey: WAITLIST_QUERY_KEYS.list });
      },
    });
  },
  revoke: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (payload: TSendAndRevokeInvitation) => {
        return await api.post("/invitations/revoke/bulk", { waitlistIds: payload.waitlistIds });
      },
      onSuccess: (_, payload) => {
        toast.success(`Invitations revoked for ${payload.waitlistIds.length} user(s)`);

        queryClient.invalidateQueries({ queryKey: WAITLIST_QUERY_KEYS.list });
      },
    });
  },
  updateStatus: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (payload: TUpdateWaitlist) => {
        return await api.patch(`/waitlist`, {
          ...payload,
        });
      },
      onSuccess: () => {
        toast.success(`Waitlist entry status updated`);

        queryClient.invalidateQueries({ queryKey: WAITLIST_QUERY_KEYS.list });
      },
    });
  },
};
