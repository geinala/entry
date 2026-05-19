import "server-only";

import { handleException } from "@/common/exception/helper";
import { getAllActiveCouriersService } from "./courier.service";
import { responseFormatter } from "@/lib/response-formatter";

export const getAllActiveCouriersController = async (simulationId: string) => {
  try {
    const result = await getAllActiveCouriersService(simulationId);

    return responseFormatter.successWithData({
      data: result,
      message: "Get all active couriers successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
