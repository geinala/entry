import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createDepotController,
  getDepotsWithPaginationController,
} from "@/server/depot/depot.controller";
import { NextRequest } from "next/server";

// GET /api/depots
export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await getDepotsWithPaginationController(req);
    },
  });
};

// POST /api/depots
export const POST = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await createDepotController(req);
    },
  });
};
