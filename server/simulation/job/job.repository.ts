import "server-only";

import { simulationJobTable, simulationTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { TUpdateSimulationJob } from "@/types/database";
import { and, desc, eq, notInArray } from "drizzle-orm";
import { TSimulationJobStatusSchema } from "@/schemas/simulations/jobs/job-status.schema";

export const createSimulationJobRepository = async (
  userId: string,
  filePath: string,
  data: TCreateSimulationJobSchema,
  fileTotalRows: number,
) => {
  const [simulationJob] = await db
    .insert(simulationJobTable)
    .values({
      ...data,
      filePath,
      userId,
      depotLocationAddress: data.depotLocationAddress,
      depotLocationLatitude: data.depotLatitude,
      depotLocationLongitude: data.depotLongitude,
      currentStep: 1,
      startedAt: new Date(data.startDatetime),
      fileTotalRows,
      fileValidationStatus: "uploaded",
      fileValidationStartedAt: new Date(),
      isWithAdaptiveParameters: data.isWithAdaptiveParameters,
    })
    .returning();

  return simulationJob;
};

export const updateSimulationJobRepository = async (
  simulationJobId: string,
  updateData: TUpdateSimulationJob,
) => {
  const [updatedSimulationJob] = await db
    .update(simulationJobTable)
    .set(updateData)
    .where(eq(simulationJobTable.id, simulationJobId))
    .returning();

  return updatedSimulationJob;
};

export const getSimulationJobsByUserIdAndStatusRepository = async (
  userId: string,
  status?: TSimulationJobStatusSchema["status"],
  excludeStatus?: TSimulationJobStatusSchema["excludeStatus"],
) => {
  const [simulationJob] = await db
    .select()
    .from(simulationJobTable)
    .where(
      and(
        eq(simulationJobTable.userId, userId),
        status ? eq(simulationJobTable.status, status) : undefined,
        excludeStatus?.length ? notInArray(simulationJobTable.status, excludeStatus) : undefined,
      ),
    )
    .orderBy(desc(simulationJobTable.createdAt));

  return simulationJob;
};

export const updateSimulationJobStatusRepository = async (
  simulationJobId: string,
  updateData: Partial<TUpdateSimulationJob>,
) => {
  const [updatedSimulationJob] = await db
    .update(simulationJobTable)
    .set(updateData)
    .where(eq(simulationJobTable.id, simulationJobId))
    .returning();

  return updatedSimulationJob;
};

export const createSimulationFromJobRepository = async (jobId: string) => {
  const [simulationJob] = await db
    .select()
    .from(simulationJobTable)
    .where(eq(simulationJobTable.id, jobId))
    .limit(1);

  const [created] = await db
    .insert(simulationTable)
    .values({
      ...simulationJob,
      status: "optimizing",
      simulationJobId: jobId,
      userId: simulationJob.userId,
      title: simulationJob.title,
      depotLocationAddress: simulationJob.depotLocationAddress,
      depotLocationLatitude: simulationJob.depotLocationLatitude,
      depotLocationLongitude: simulationJob.depotLocationLongitude,
      startedAt: simulationJob.startedAt,
      depotId: simulationJob.depotId,
      isWithAdaptiveParameters: simulationJob.isWithAdaptiveParameters,
    })
    .returning();

  return created;
};
