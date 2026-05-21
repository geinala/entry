import "server-only";

import { handleException } from "@/common/exception/helper";
import { getAllCouriersService } from "./courier.service";
import { responseFormatter } from "@/lib/response-formatter";

export const getAllCouriersController = async (simulationId: string) => {
  try {
    const result = await getAllCouriersService(simulationId);

    return responseFormatter.successWithData({
      data: result,
      message: "Get all couriers successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
