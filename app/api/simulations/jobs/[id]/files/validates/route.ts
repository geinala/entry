import { handleAuthenticatedRequest } from "@/lib/request";
import { deleteAllSimulationUploadedErrorsController } from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

// DELETE /simulations/jobs/:id/files/validates/rows
// Bulk delete all error rows for the job, used when user wants to "Delete All Errors and Continue"
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await deleteAllSimulationUploadedErrorsController(id);
    },
  });
};
