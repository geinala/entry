import "server-only";

import { simulationJobTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";

export const createSimulationJobRepository = async (
  userId: string,
  filePath: string,
  data: TCreateSimulationJobSchema,
) => {
  return await db
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
    })
    .returning();
};
