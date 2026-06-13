import { simulationJobTable, simulationUploadedRows } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export const ignoreAllErrorAddressRowsAndContinueRepository = async (simulationJobId: string) => {
  return await db.transaction(async (tx) => {
    await tx
      .update(simulationUploadedRows)
      .set({
        isIgnored: true,
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
  const [updatedRow] = await db
    .update(simulationUploadedRows)
    .set({
      isIgnored: true,
    })
    .where(
      and(eq(simulationUploadedRows.simulationJobId, jobId), eq(simulationUploadedRows.id, rowId)),
    )
    .returning();

  return updatedRow;
};
