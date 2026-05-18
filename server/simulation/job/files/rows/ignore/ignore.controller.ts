import "server-only";

import { handleException } from "@/common/exception/helper";
import {
  ignoreAllErrorAddressRowsAndContinueService,
  ignoreErrorAddressRowByIdService,
} from "./ignore.service";
import { responseFormatter } from "@/lib/response-formatter";

export const ignoreAllErrorAddressRowsAndContinueController = async (simulationJobId: string) => {
  try {
    await ignoreAllErrorAddressRowsAndContinueService(simulationJobId);

    return responseFormatter.success({
      message: "All error rows ignored and process continued successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const ignoreErrorAddressRowByIdController = async (jobId: string, rowId: number) => {
  try {
    const result = await ignoreErrorAddressRowByIdService(jobId, rowId);

    return responseFormatter.successWithData({
      message: "Error row ignored successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};
