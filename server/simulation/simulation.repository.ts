import { simulationTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TCreateSimulationSchema } from "@/schemas/simulation.schema";
import "server-only";

export const createSimulationRepository = async (userId: number, data: TCreateSimulationSchema) => {
  return await db
    .insert(simulationTable)
    .values({
      title: data.title,
      userId,
    })
    .returning();
};
