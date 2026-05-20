import { simulationLogTable } from "@/drizzle/schema";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexQueryParams } from "@/types/query-params";
import { eq } from "drizzle-orm";

const SIMULATION_LOG_COLUMNS: TColumnsDefinition<typeof simulationLogTable> = {
  createdAt: { sortable: true },
};

export const getSimulationLogsWithPaginationRepository = async (
  simulationId: string,
  queryParams: TIndexQueryParams,
  sort?: TIndexQueryParams["sort"],
) => {
  const mergedQueryParams = { ...queryParams, sort };

  return await Promise.all([
    await buildPaginatedQuery({
      table: simulationLogTable,
      columns: SIMULATION_LOG_COLUMNS,
      queryParams: mergedQueryParams,
      baseConditions: [eq(simulationLogTable.simulationId, simulationId)],
    }),
    await buildCountQuery({
      table: simulationLogTable,
      columns: SIMULATION_LOG_COLUMNS,
      queryParams: mergedQueryParams,
      baseConditions: [eq(simulationLogTable.simulationId, simulationId)],
    }),
  ]);
};
