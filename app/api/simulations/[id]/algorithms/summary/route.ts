import { handleAuthenticatedRequest } from "@/lib/request";
import { getGlobalSummaryAlgorithmController } from "@/server/simulation/summary/summary.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const searchParams = req.nextUrl.searchParams;
  const courierId = searchParams.get("courierId") || undefined;

  return await handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      return await getGlobalSummaryAlgorithmController(id, courierId);
    },
  });
};
