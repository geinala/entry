import { handleAuthenticatedRequest } from "@/lib/request";
import { getAllNeedReviewSimulationUploadedRowsWithPaginationController } from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/:id/files/rows/reviews
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getAllNeedReviewSimulationUploadedRowsWithPaginationController(request, id);
    },
  });
};
