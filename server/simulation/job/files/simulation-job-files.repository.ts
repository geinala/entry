import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { and, eq } from "drizzle-orm";
import { TIndexQueryParams } from "@/types/query-params";
import { simulationUploadedRows } from "@/drizzle/schema";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { db } from "@/lib/db";

const SIMULATION_UPLOADED_ROWS_COLUMNS: TColumnsDefinition<typeof simulationUploadedRows> = {};

export const getSimulationUploadedRows = async (jobId: string, queryParams: TIndexQueryParams) => {
  return await buildPaginatedQuery({
    table: simulationUploadedRows,
    columns: SIMULATION_UPLOADED_ROWS_COLUMNS,
    queryParams,
    baseConditions: [eq(simulationUploadedRows.simulationJobId, jobId)],
  });
};

export const getSimulationUploadedRowsCountRepository = async (
  jobId: string,
  queryParams: TIndexQueryParams,
) => {
  return await buildCountQuery({
    table: simulationUploadedRows,
    columns: SIMULATION_UPLOADED_ROWS_COLUMNS,
    queryParams,
    baseConditions: [eq(simulationUploadedRows.simulationJobId, jobId)],
  });
};

export const updateSimulationUploadedRowRepository = async (
  jobId: string,
  rowId: number,
  payload: TUpdateSimulationUploadedRowSchema,
) => {
  const [updatedRow] = await db
    .update(simulationUploadedRows)
    .set({
      nosi: payload.nosi,
      courier: payload.courier,
      customerName: payload.customerName,
      address: payload.address,
      city: payload.city,
      weight: payload.weight,
      startDatetime: new Date(payload.startDatetime),
      endDatetime: new Date(payload.endDatetime),
      errorDetails: null,
    })
    .where(
      and(
        eq(simulationUploadedRows.simulationJobId, jobId),
        eq(simulationUploadedRows.id, rowId),
      ),
    )
    .returning();

  return updatedRow;
};

export const deleteSimulationUploadedRowRepository = async (jobId: string, rowId: number) => {
  const [deletedRow] = await db
    .delete(simulationUploadedRows)
    .where(
      and(
        eq(simulationUploadedRows.simulationJobId, jobId),
        eq(simulationUploadedRows.id, rowId),
      ),
    )
    .returning();

  return deletedRow;
};
