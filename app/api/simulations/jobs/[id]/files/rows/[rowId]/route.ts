import { handleAuthenticatedRequest } from "@/lib/request";
import {
  deleteSimulationUploadedRowController,
  updateSimulationUploadedRowController,
} from "@/server/simulation/job/files/simulation-job-files.controller";
import { NextRequest } from "next/server";

// PATCH /simulations/jobs/:id/files/rows/:rowId
export const PATCH = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id, rowId } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await updateSimulationUploadedRowController(id, rowId, request);
    },
  });
};

// DELETE /simulations/jobs/:id/files/rows/:rowId
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id, rowId } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await deleteSimulationUploadedRowController(id, rowId);
    },
  });
};
