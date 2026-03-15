import { vehicleTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const getAllActiveVehiclesRepository = async (simulationId: string) => {
  return await db
    .select()
    .from(vehicleTable)
    .where(and(eq(vehicleTable.simulationId, simulationId), eq(vehicleTable.isActive, true)));
};
