import { handleAuthenticatedRequest } from "@/lib/request";
import { ignoreErrorAddressRowByIdController } from "@/server/simulation/job/files/rows/ignore/ignore.controller";
import { NextRequest } from "next/server";

/**
 * Ignore error address rows by row id and job id
 *
 * POST /simulations/jobs/:id/files/rows/:rowId/ignore
 */
export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id, rowId } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await ignoreErrorAddressRowByIdController(id, Number(rowId));
    },
  });
};
