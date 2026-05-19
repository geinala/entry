import "server-only";

import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { preOptimizeService } from "./pre-optimize.service";

export const preOptimizeController = async (userId: string, jobId: string) => {
  try {
    const summary = await preOptimizeService(userId, jobId);

    if (!summary) {
      return responseFormatter.notFound("Simulation job not found");
    }

    return responseFormatter.successWithData({
      data: summary,
      message: "Simulation job summary retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
