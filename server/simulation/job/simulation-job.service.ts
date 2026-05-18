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
import { countCsvRows } from "@/lib/utils";

export const createSimulationJobService = async (
  clerkUserId: string,
  data: TCreateSimulationJobSchema,
) => {
  const fileTotalRows = await countCsvRows(data.customersFile);
  const minioUploadedFile = await uploadFileService(data.customersFile, `dataset/raw`);

  const result = await createSimulationJobRepository(
    clerkUserId,
    minioUploadedFile.filePath,
    data,
    fileTotalRows,
  );

  try {
    await server.post(`/simulations/jobs/${result.id}/preprocess`);
  } catch (error) {
    await updateSimulationJobRepository(result.id, {
      fileValidationStatus: "failed",
      filePath: null,
      fileValidationCompletedAt: new Date(),
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
  const updatePayload = {
    ...(payload.currentStep && {
      currentStep: payload.currentStep,
    }),

    ...(payload.fileValidationStatus && {
      fileValidationStatus: payload.fileValidationStatus,
    }),

    ...(payload.validationCompletedAt && {
      validationCompletedAt: new Date(payload.validationCompletedAt),
    }),
  };

  const updatedJob = await updateSimulationJobRepository(simulationJobId, updatePayload);

  if (
    payload.fileValidationStatus === "completed" &&
    updatedJob.filePath &&
    updatedJob.validationCompletedAt
  ) {
    try {
      await server.post(`/simulations/jobs/${simulationJobId}/process`);
    } catch (error) {
      await updateSimulationJobStatusRepository(simulationJobId, "failed");
      throw error;
    }
  }

  return updatedJob;
};
