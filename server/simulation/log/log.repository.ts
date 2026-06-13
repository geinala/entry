import { courierTable, simulationLogTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexQueryParams } from "@/types/query-params";
import { and, eq } from "drizzle-orm";

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

export const getSimulationLogByIdRepository = async (simulationId: string, logId: number) => {
  const [log] = await db
    .select()
    .from(simulationLogTable)
    .leftJoin(courierTable, eq(simulationLogTable.courierId, courierTable.id))
    .where(
      and(eq(simulationLogTable.id, logId), eq(simulationLogTable.simulationId, simulationId)),
    );

  return log;
};
