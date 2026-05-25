import { TIndexQueryParams } from "@/types/query-params";
import { getReoptimizationEventsWithPaginationRepository } from "./reoptimization.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TReoptimizationEvent } from "@/types/database";

export const getReoptimizationEventsWithPaginationService = async (
  simulationId: string,
  queryParams: TIndexQueryParams,
) => {
  const [paginatedEvents, totalEvents] = await getReoptimizationEventsWithPaginationRepository(
    simulationId,
    queryParams,
  );

  return paginationResponseMapper<TReoptimizationEvent>(paginatedEvents, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: totalEvents,
  });
};
