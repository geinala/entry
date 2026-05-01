import "server-only";

import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { uploadFileService } from "@/server/files/file.service";
import { createSimulationJobRepository } from "./simulation-job.repository";

export const createSimulationJobService = async (
  clerkUserId: string,
  data: TCreateSimulationJobSchema,
) => {
  const minioUploadedFile = await uploadFileService(data.customersFile, `dataset/raw`);

  return await createSimulationJobRepository(clerkUserId, minioUploadedFile.filePath, data);
};
