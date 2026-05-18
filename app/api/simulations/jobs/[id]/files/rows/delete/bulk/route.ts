import { handleAuthenticatedRequest } from "@/lib/request";
import { deleteSimulationUploadedRowsBulkController } from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

/**
 * Bulk delete simulation uploaded rows
 *
 * This endpoint is used to delete all simulation uploaded rows with "error"
 * for a simulation job, and continue to next step in the workflow.
 *
 * GET /simulations/jobs/:id/files/rows/bulk
 */
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await deleteSimulationUploadedRowsBulkController(request, id);
    },
  });
};
