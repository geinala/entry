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
      filePath,
      userId,
      depotLocationAddress: data.depotLocationAddress,
      depotLocationLatitude: data.depotLatitude,
      depotLocationLongitude: data.depotLongitude,
      title: data.title,
      currentStep: 1,
      maxComputationTimeInSeconds: data.computationTimeLimit,
      startedAt: new Date(data.startDatetime),
      fileTotalRows,
      fileValidationStatus: "uploaded",
      fileValidationStartedAt: new Date(),
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

export const getSimulationBySimulationJobIdRepository = async (simulationJobId: string) => {
  const [simulation] = await db
    .select()
    .from(simulationTable)
    .where(eq(simulationTable.simulationJobId, simulationJobId));

  return simulation;
};
