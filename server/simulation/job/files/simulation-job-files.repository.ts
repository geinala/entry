import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { and, eq, isNull, SQL, sql } from "drizzle-orm";
import { simulationJobTable, simulationUploadedRows } from "@/drizzle/schema";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { db } from "@/lib/db";
import { TSimulationJobFilesIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";

const SIMULATION_UPLOADED_ROWS_COLUMNS: TColumnsDefinition<typeof simulationUploadedRows> = {};

const buildSimulationUploadedRowsBaseConditions = (
  jobId: string,
  queryParams: TSimulationJobFilesIndexQueryParams,
): Array<SQL | undefined> => {
  const { onlyAddressErrors, onlyErrors } = queryParams;
  const baseConditions: Array<SQL | undefined> = [
    eq(simulationUploadedRows.simulationJobId, jobId),
  ];

  if (onlyAddressErrors) {
    baseConditions.push(
      and(isNull(simulationUploadedRows.streetCandidate), isNull(simulationUploadedRows.deletedAt)),
    );
  } else if (onlyErrors) {
    baseConditions.push(
      sql`jsonb_typeof(${simulationUploadedRows.errorDetails}) = 'array'`,
      sql`jsonb_array_length(${simulationUploadedRows.errorDetails}) > 0`,
      isNull(simulationUploadedRows.deletedAt),
    );
  }

  return baseConditions;
};

export const getSimulationUploadedErrorsRowsWithPaginationRepository = async (
  jobId: string,
  queryParams: TSimulationJobFilesIndexQueryParams,
) => {
  return await Promise.all([
    await buildPaginatedQuery({
      table: simulationUploadedRows,
      columns: SIMULATION_UPLOADED_ROWS_COLUMNS,
      queryParams,
      baseConditions: buildSimulationUploadedRowsBaseConditions(jobId, queryParams),
    }),
    await buildCountQuery({
      table: simulationUploadedRows,
      columns: SIMULATION_UPLOADED_ROWS_COLUMNS,
      queryParams,
      baseConditions: buildSimulationUploadedRowsBaseConditions(jobId, queryParams),
    }),
  ]);
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
      and(eq(simulationUploadedRows.simulationJobId, jobId), eq(simulationUploadedRows.id, rowId)),
    )
    .returning();

  return updatedRow;
};

export const deleteSimulationUploadedRowRepository = async (jobId: string, rowId: number) => {
  const [deletedRow] = await db
    .update(simulationUploadedRows)
    .set({
      deletedAt: new Date(),
    })
    .where(
      and(eq(simulationUploadedRows.simulationJobId, jobId), eq(simulationUploadedRows.id, rowId)),
    )
    .returning();

  return deletedRow;
};

export const deleteAllSimulationUploadedErrorsAndContinueRepository = async (jobId: string) => {
  await db.transaction(async (tx) => {
    await tx
      .update(simulationUploadedRows)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(simulationUploadedRows.simulationJobId, jobId),
          sql`jsonb_typeof(${simulationUploadedRows.errorDetails}) = 'array'`,
          sql`jsonb_array_length(${simulationUploadedRows.errorDetails}) > 0`,
        ),
      );

    await tx
      .update(simulationJobTable)
      .set({
        currentStep: sql`${simulationJobTable.currentStep} + 1`,
        fileValidationStatus: "completed",
      })
      .where(eq(simulationJobTable.id, jobId));
  });
};
