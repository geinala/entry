import { handleException } from "@/common/exception/helper";
import { validateSchema } from "@/lib/validation";
import {
  CourierIdParamWithSimulationIdParamSchema,
  TCourierIdParamWithSimulationIdParamSchema,
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
      courierId: searchParams.get("courierId") || undefined,
    };

    const parsed = validateSchema<TCourierIdParamWithSimulationIdParamSchema>(
      CourierIdParamWithSimulationIdParamSchema,
      { simulationId, ...rawQueryParams },
    );

    const result = await getLatestRouteBySimulationIdService(
      parsed.data.simulationId,
      parsed.data.courierId,
    );

    return responseFormatter.successWithData({
      data: result,
      message: "Latest route retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
