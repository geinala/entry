import { handleAuthenticatedRequest } from "@/lib/request";
import {
  deleteAllSimulationUploadedErrorsController,
  getSimulationUploadedErrorRowsWithPaginationController,
} from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/:id/files/validates/rows
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getSimulationUploadedErrorRowsWithPaginationController(id, request);
    },
  });
};

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
