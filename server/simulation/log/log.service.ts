import { TIndexQueryParams } from "@/types/query-params";
import { getSimulationLogsWithPaginationRepository } from "./log.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TSimulationLog } from "@/types/database";

export const getSimulationLogsWithPaginationService = async (
  simulationId: string,
  queryParams: TIndexQueryParams,
) => {
  const defaultSort = [{ key: "createdAt", direction: "desc" as const }];

  const [entries, total] = await getSimulationLogsWithPaginationRepository(
    simulationId,
    queryParams,
    defaultSort,
  );

  return paginationResponseMapper<TSimulationLog>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};
