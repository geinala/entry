import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation } from "@tanstack/react-query";
import { waitlistMutations } from "../_api/mutations";

export const useSendInvitationMutation = () => {
  const api = useAuthenticatedClient();

  return useMutation(waitlistMutations.send(api));
};
