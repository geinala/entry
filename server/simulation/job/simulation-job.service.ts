import "server-only";

import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { uploadFileService } from "@/server/files/file.service";
import {
  createSimulationJobRepository,
  updateSimulationJobRepository,
} from "./simulation-job.repository";
import { server } from "@/lib/axios";

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
