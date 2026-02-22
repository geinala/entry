import { TIndexRoleQueryParams } from "@/schemas/role.schema";
import { getRolesCountRepository, getRolesWithPaginationRepository } from "./role.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TRole } from "@/types/database";

export const getRolesWithPaginationService = async (queryParams: TIndexRoleQueryParams) => {
  try {
    const [entries, total] = await Promise.all([
      getRolesWithPaginationRepository(queryParams),
      getRolesCountRepository(queryParams),
    ]);

    return paginationResponseMapper<TRole>(entries, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: total,
    });
  } catch (error) {
    throw error;
  }
};
