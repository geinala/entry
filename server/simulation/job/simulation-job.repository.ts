import "server-only";

import { simulationJobTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { TUpdateSimulationJob } from "@/types/database";
import { eq } from "drizzle-orm";

export const createSimulationJobRepository = async (
  userId: string,
  filePath: string,
  data: TCreateSimulationJobSchema,
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
      fileValidationStatus: "uploaded",
      validationStartedAt: new Date(),
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
