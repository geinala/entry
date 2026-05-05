import { handleAuthenticatedRequest } from "@/lib/request";
import { getSimulationUploadedRowsController } from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/:id/files/rows
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getSimulationUploadedRowsController(id, request);
    },
  });
};
