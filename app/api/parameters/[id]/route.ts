import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { NextRequest } from "next/server";
import { getParameterByIdController } from "@/server/parameter/parameter.controller";

// GET /api/depots/[id]
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getParameterByIdController(id);
    },
  });
};
