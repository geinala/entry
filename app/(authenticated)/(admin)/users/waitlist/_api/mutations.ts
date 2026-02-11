import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const waitlistMutations = {
  invite: (id: number, api: ReturnType<typeof useAuthenticatedClient>) => {
    return mutationOptions({
      mutationFn: () => api.post(`/waitlist/${id}/invite`),
      onSuccess: () => {
        toast.success("User invited successfully");
      },
    });
  },
};
