import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import "server-only";
import { getGlobalSummaryAlgorithmService } from "./summary.service";

export const getGlobalSummaryAlgorithmController = async (simulationId: string) => {
  try {
    const result = await getGlobalSummaryAlgorithmService(simulationId);

    return responseFormatter.successWithData({
      message: "Global summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};
