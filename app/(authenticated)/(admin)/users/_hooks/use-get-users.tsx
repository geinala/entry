import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { GetUsersQueryParamsType } from "@/server/user/user.schema";
import { User } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (options: GetUsersQueryParamsType) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["users", options],
    queryFn: async (): Promise<TPaginationResponse<User[]>> => {
      return await api.get("/users", { params: options });
    },
  });
};
