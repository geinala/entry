import "server-only";

import { tuningExperimentDatasetTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { eq } from "drizzle-orm";
import { TIndexParameterQueryParams } from "@/schemas/parameter.schema";
import { TTuningExperimentDataset } from "@/types/database";

const PARAMETER_COLUMNS: TColumnsDefinition<typeof tuningExperimentDatasetTable> = {};

export const getParametersWithPaginationRepository = async (
  queryParams: TIndexParameterQueryParams,
) => {
  return await buildPaginatedQuery({
    table: tuningExperimentDatasetTable,
    columns: PARAMETER_COLUMNS,
    queryParams,
  });
};

export const getParametersCountRepository = async (queryParams: TIndexParameterQueryParams) => {
  return await buildCountQuery({
    table: tuningExperimentDatasetTable,
    columns: PARAMETER_COLUMNS,
    queryParams,
  });
};

export const getParameterByIdRepository = async (id: string) => {
  const [parameter] = await db
    .select()
    .from(tuningExperimentDatasetTable)
    .where(eq(tuningExperimentDatasetTable.id, id))
    .limit(1);

  return parameter;
};

export const createParameterRepository = async (filePath: string) => {
  const [parameter] = await db
    .insert(tuningExperimentDatasetTable)
    .values({
      filePath,
    })
    .returning();

  return parameter;
};

export const updateTuningExperminetDatasetStatusRepository = async ({
  status,
  tuningExperimentDatasetId,
}: {
  tuningExperimentDatasetId: string;
  status: TTuningExperimentDataset["status"];
}) => {
  const [result] = await db
    .update(tuningExperimentDatasetTable)
    .set({
      status,
    })
    .where(eq(tuningExperimentDatasetTable.id, tuningExperimentDatasetId))
    .returning();

  return result;
};
