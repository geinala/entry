import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { User } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { IndexQueryParamsType } from "@/types/query-params";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (options: IndexQueryParamsType) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["users", options],
    queryFn: async (): Promise<TPaginationResponse<User[]>> => {
      return await api.get("/users", { params: options });
    },
  });
};
