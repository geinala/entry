import { handleAuthenticatedRequest } from "@/lib/request";
import { ignoreAllErrorAddressRowsAndContinueController } from "@/server/simulation/job/files/rows/ignore/ignore.controller";
import { NextRequest } from "next/server";

/**
 * Ignore all address rows and continue to next step
 *
 * POST /simulations/jobs/:id/files/rows/ignore
 */
export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await ignoreAllErrorAddressRowsAndContinueController(id);
    },
  });
};
