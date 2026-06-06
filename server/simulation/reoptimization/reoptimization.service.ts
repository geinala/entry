import { getReoptimizationEventsWithPaginationRepository } from "./reoptimization.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TReoptimizationEvent } from "@/types/database";
import { TReoptimizationEventTableIndexQueryParams } from "@/schemas/simulations/reoptimization-event.schema";

export const getReoptimizationEventsWithPaginationService = async (
  simulationId: string,
  queryParams: TReoptimizationEventTableIndexQueryParams,
) => {
  const [paginatedEvents, totalEvents] = await getReoptimizationEventsWithPaginationRepository(
    simulationId,
    {
      ...queryParams,
      sort: [{ key: "checkedAt", direction: "desc" }],
    },
  );

  return paginationResponseMapper<TReoptimizationEvent>(paginatedEvents, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: totalEvents,
  });
};
