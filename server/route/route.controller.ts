import { handleException } from "@/common/exception/helper";
import { validateSchema } from "@/lib/validation";
import {
  TVehicleIdParamWithSimulationIdParamSchema,
  VehicleIdParamWithSimulationIdParamSchema,
} from "@/schemas/simulation.schema";
import { responseFormatter } from "@/lib/response-formatter";
import { getLatestRouteBySimulationIdService } from "./route.service";
import { NextRequest } from "next/server";

export const getLatestRouteBySimulationIdController = async (
  req: NextRequest,
  simulationId: string,
) => {
  try {
    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      vehicleId: searchParams.get("vehicleId") || undefined,
    };

    const parsed = validateSchema<TVehicleIdParamWithSimulationIdParamSchema>(
      VehicleIdParamWithSimulationIdParamSchema,
      { simulationId, ...rawQueryParams },
    );

    const result = await getLatestRouteBySimulationIdService(
      parsed.data.simulationId,
      parsed.data.vehicleId,
    );

    return responseFormatter.successWithData({
      data: result,
      message: "Latest route retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
