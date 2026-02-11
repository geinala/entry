import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation } from "@tanstack/react-query";
import { waitlistMutations } from "../_api/mutations";

export const useInviteWaitlistEntryMutation = (id: number) => {
  const api = useAuthenticatedClient();

  return useMutation(waitlistMutations.invite(id, api));
};
