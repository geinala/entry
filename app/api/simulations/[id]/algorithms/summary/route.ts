import { handleAuthenticatedRequest } from "@/lib/request";
import { getGlobalSummaryAlgorithmController } from "@/server/simulation/summary/summary.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      return await getGlobalSummaryAlgorithmController(id, req);
    },
  });
};
