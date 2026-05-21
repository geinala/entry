import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import {
  deleteDepotController,
  getDepotByIdController,
  updateDepotController,
} from "@/server/depot/depot.controller";
import { NextRequest } from "next/server";

// GET /api/depots/[id]
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await getDepotByIdController(req, Number(id));
    },
  });
};

// PATCH /api/depots/[id]
export const PATCH = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await updateDepotController(req, Number(id));
    },
  });
};

// DELETE /api/depots/[id]
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (req) => {
      return await deleteDepotController(req, Number(id));
    },
  });
};