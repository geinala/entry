import { courierTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, asc, eq } from "drizzle-orm";

export const getAllCouriersRepository = async (simulationId: string) => {
  return await db
    .select()
    .from(courierTable)
    .where(and(eq(courierTable.simulationId, simulationId)))
    .orderBy(asc(courierTable.name));
};
