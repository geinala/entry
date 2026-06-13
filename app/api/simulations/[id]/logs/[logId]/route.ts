import { handleAuthenticatedRequest } from "@/lib/request";
import { getSimulationLogByIdController } from "@/server/simulation/log/log.controller";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; logId: string }> },
) => {
  const { id, logId } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getSimulationLogByIdController(id, Number(logId));
    },
  });
};
