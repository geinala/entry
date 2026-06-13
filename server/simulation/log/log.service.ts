import { TIndexQueryParams } from "@/types/query-params";
import {
  getSimulationLogByIdRepository,
  getSimulationLogsWithPaginationRepository,
} from "./log.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TSimulationLog, TSimulationLogWithCourier } from "@/types/database";

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

export const getSimulationLogByIdService = async (
  simulationId: string,
  logId: number,
): Promise<TSimulationLogWithCourier | null> => {
  const { couriers, simulation_logs } = await getSimulationLogByIdRepository(simulationId, logId);

  return {
    ...simulation_logs,
    courier: couriers
      ? {
          id: couriers.id,
          name: couriers.name,
        }
      : undefined,
  };
};
