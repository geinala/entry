import { handleAuthenticatedRequest } from "@/lib/request";
import { getAllActiveVehiclesController } from "@/server/vehicle/vehicle.controller";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getAllActiveVehiclesController(id);
    },
  });
};
