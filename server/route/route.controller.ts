import { handleException } from "@/common/exception/helper";
import { validateSchema } from "@/lib/validation";
import { SimulationIdParamSchema } from "@/schemas/simulation.schema";
import { responseFormatter } from "@/lib/response-formatter";
import { getLatestRouteBySimulationIdService } from "./route.service";

export const getLatestRouteBySimulationIdController = async (simulationId: string) => {
  try {
    validateSchema(SimulationIdParamSchema, { simulationId });

    const result = await getLatestRouteBySimulationIdService(simulationId);

    return responseFormatter.successWithData({
      data: result,
      message: "Latest route retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
