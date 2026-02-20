import { client } from "@/lib/axios";
import { mutationOptions } from "@tanstack/react-query";

export const ticketMutations = {
  acceptTicket: mutationOptions({
    mutationFn: async (token: string) => {
      return await client.post("/invitations/" + token);
    },
  }),
};
