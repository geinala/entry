import { handleException } from "@/common/exception/helper";
import { getAllActiveVehiclesService } from "./vehicle.service";
import { responseFormatter } from "@/lib/response-formatter";

export const getAllActiveVehiclesController = async (simulationId: string) => {
  try {
    const result = getAllActiveVehiclesService(simulationId);

    return responseFormatter.successWithData({
      data: result,
      message: "Get all active vehicles successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
