import { courierTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const getAllActiveCouriersRepository = async (simulationId: string) => {
  return await db
    .select()
    .from(courierTable)
    .where(and(eq(courierTable.simulationId, simulationId), eq(courierTable.isActive, true)));
};
