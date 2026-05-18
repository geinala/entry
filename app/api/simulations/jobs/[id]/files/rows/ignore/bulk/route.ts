import { handleAuthenticatedRequest } from "@/lib/request";
import { ignoreSimulationUploadedRowsBulkController } from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

/**
 * Bulk ignore address rows
 *
 * GET /simulations/jobs/:id/files/rows/bulk/ignore
 */
export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await ignoreSimulationUploadedRowsBulkController(request, id);
    },
  });
};
