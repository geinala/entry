import { simulationJobTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import "server-only";

export const deleteDraftSimulationJobRepository = async (userId: string) => {
  return await db
    .delete(simulationJobTable)
    .where(
      and(
        eq(simulationJobTable.userId, userId),
        notInArray(simulationJobTable.status, ["completed", "failed"]),
      ),
    );
};

export const getDraftSimulationJobRepository = async (userId: string) => {
  const [draftSimulationJob] = await db
    .select()
    .from(simulationJobTable)
    .where(
      and(
        eq(simulationJobTable.userId, userId),
        inArray(simulationJobTable.status, ["uploaded", "processing"]),
        notInArray(simulationJobTable.status, ["completed", "failed"]),
      ),
    )
    .limit(1);

  return draftSimulationJob;
};
