import { simulationJobTable, simulationUploadedRows } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export const ignoreAllErrorAddressRowsAndContinueRepository = async (simulationJobId: string) => {
  return await db.transaction(async (tx) => {
    const [simulationJob] = await tx
      .select()
      .from(simulationJobTable)
      .where(eq(simulationJobTable.id, simulationJobId));

    await tx
      .update(simulationUploadedRows)
      .set({
        isIgnored: true,
        resolutionStatus: "manual_override",
        latitude: simulationJob.depotLocationLatitude, // Set latitude to depot location latitude when ignoring the error
        longitude: simulationJob.depotLocationLongitude, // Set longitude to depot location longitude when ignoring the error
      })
      .where(
        and(
          eq(simulationUploadedRows.simulationJobId, simulationJobId),
          eq(simulationUploadedRows.resolutionStatus, "needed_review"),
        ),
      );

    await tx
      .update(simulationJobTable)
      .set({
        currentStep: sql`${simulationJobTable.currentStep} + 1`,
      })
      .where(eq(simulationJobTable.id, simulationJobId));
  });
};

export const ignoreErrorAddressRowByIdRepository = async (jobId: string, rowId: number) => {
  const [updatedRow] = await db.transaction(async (tx) => {
    const [simulationJob] = await tx
      .select()
      .from(simulationJobTable)
      .where(eq(simulationJobTable.id, jobId));

    const updatedRow = await tx
      .update(simulationUploadedRows)
      .set({
        isIgnored: true,
        resolutionStatus: "manual_override",
        latitude: simulationJob.depotLocationLatitude, // Set latitude to depot location latitude when ignoring the error
        longitude: simulationJob.depotLocationLongitude, // Set longitude to depot location longitude when ignoring the error
      })
      .where(
        and(
          eq(simulationUploadedRows.simulationJobId, jobId),
          eq(simulationUploadedRows.id, rowId),
        ),
      )
      .returning();

    return updatedRow;
  });

  return updatedRow;
};
