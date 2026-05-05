import "server-only";

import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { uploadFileService } from "@/server/files/file.service";
import {
  createSimulationJobRepository,
  getSimulationJobsByUserIdAndStatusRepository,
  updateSimulationJobRepository,
  updateSimulationJobStatusRepository,
} from "./simulation-job.repository";
import { server } from "@/lib/axios";
import { TSimulationJobStatusSchema } from "@/schemas/simulations/jobs/job-status.schema";
import { TUpdateSimulationJobSchema } from "@/schemas/simulations/jobs/update-simulation-job.schema";

export const createSimulationJobService = async (
  clerkUserId: string,
  data: TCreateSimulationJobSchema,
) => {
  const minioUploadedFile = await uploadFileService(data.customersFile, `dataset/raw`);

  const result = await createSimulationJobRepository(clerkUserId, minioUploadedFile.filePath, data);

  try {
    await server.post(`/simulations/jobs/${result.id}/files`);
  } catch (error) {
    console.log("Error notifying simulation job about uploaded file:", error);

    await updateSimulationJobRepository(result.id, {
      fileValidationStatus: "failed",
      filePath: null,
      validationCompletedAt: new Date(),
    });

    throw error;
  }

  return result;
};

export const getSimulationJobsByUserIdAndStatusService = async (
  clerkUserId: string,
  status: TSimulationJobStatusSchema["status"],
  excludeStatus?: TSimulationJobStatusSchema["excludeStatus"],
) => {
  return await getSimulationJobsByUserIdAndStatusRepository(clerkUserId, status, excludeStatus);
};

export const updateSimulationJobService = async (
  simulationJobId: string,
  payload: TUpdateSimulationJobSchema,
) => {
  return await updateSimulationJobStatusRepository(simulationJobId, {
    currentStep: payload.nextStep,
    fileValidationStatus: payload.fileValidationStatus,
  });
};
