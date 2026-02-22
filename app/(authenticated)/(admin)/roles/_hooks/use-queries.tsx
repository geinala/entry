import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexRoleQueryParams } from "@/schemas/role.schema";
import { useQuery } from "@tanstack/react-query";
import { roleQueries } from "../_api/queries";

export const useGetRolesWithPaginationQuery = (queryParams: TIndexRoleQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery(roleQueries.list(api, queryParams));
};
