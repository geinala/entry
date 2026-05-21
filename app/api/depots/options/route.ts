import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { getDepotOptionsController } from "@/server/depot/depot.controller";
import { NextRequest } from "next/server";

// GET /api/depots/options
export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await getDepotOptionsController(req);
    },
  });
};
