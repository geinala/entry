import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { NextRequest } from "next/server";
import {
  createParameterController,
  getParametersWithPaginationController,
} from "@/server/parameter/parameter.controller";

// GET /api/parameters
export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await getParametersWithPaginationController(req);
    },
  });
};

// POST /api/parameters
export const POST = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await createParameterController(req);
    },
  });
};
