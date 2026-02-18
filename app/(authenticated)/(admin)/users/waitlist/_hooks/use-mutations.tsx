"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { waitlistMutations } from "../_api/mutations";

/**
 * Hook for sending invitations to waitlist entries
 * Handles mutation state, cache invalidation, and error logging
 */
export const useSendInvitationMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(waitlistMutations.send(api, queryClient));
};

export const useUpdateWaitlistStatusMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(waitlistMutations.updateStatus(api, queryClient));
};
