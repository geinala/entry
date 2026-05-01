import { simulationJobTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import "server-only";

export const deleteDraftSimulationJobRepository = async (userId: string) => {
  return await db
    .delete(simulationJobTable)
    .where(and(eq(simulationJobTable.userId, userId), eq(simulationJobTable.status, "uploaded")));
};

export const getDraftSimulationJobRepository = async (userId: string) => {
  return await db
    .select()
    .from(simulationJobTable)
    .where(and(eq(simulationJobTable.userId, userId), eq(simulationJobTable.status, "uploaded")))
    .limit(1);
};
