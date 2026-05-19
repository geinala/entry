import "server-only";
import {
  deleteDraftSimulationJobRepository,
  getDraftSimulationJobRepository,
} from "./draft.repository";
import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";

export const deleteDraftSimulationJobController = async (userId: string) => {
  try {
    await deleteDraftSimulationJobRepository(userId);

    return responseFormatter.deleted({
      message: "Draft simulation job deleted successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getDraftSimulationJobController = async (userId: string) => {
  try {
    const draftJob = await getDraftSimulationJobRepository(userId);

    return responseFormatter.successWithData({
      message: "Draft simulation job retrieved successfully",
      data: draftJob ?? null,
    });
  } catch (error) {
    return handleException(error);
  }
};
