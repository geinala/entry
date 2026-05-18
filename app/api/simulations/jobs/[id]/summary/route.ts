import { handleAuthenticatedRequest } from "@/lib/request";
import { getSimulationJobSummaryController } from "@/server/simulation/job/summary/simulation-job-summary.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/[id]/summary
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return handleAuthenticatedRequest({
    request,
    callback: async (_, authData) => {
      return await getSimulationJobSummaryController(authData.clerkUserId, id);
    },
  });
};
