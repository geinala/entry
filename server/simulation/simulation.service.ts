import "server-only";

import { TCreateSimulationSchema, TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { findCurrentUserByClerkUserIdRepository } from "../user/user.repository";
import { NotFoundException } from "@/common/exception/not-found.exception";
import {
  createSimulationRepository,
  createSimulationUploadedFileRepository,
  getSimulationByIdRepository,
  getSimulationsCountRepository,
  getSimulationsWithPaginationRepository,
  getSimulationUploadedFileBySimulationIdRepository,
  updateSimulationRepository,
  updateSimulationUploadedFileRepository,
} from "./simulation.repository";
import { TPaginationResponse } from "@/types/meta";
import { TSimulation, TSimulationWithUploadedFile } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";
import { findCurrentUserByClerkUserIdService } from "../user/user.service";
import { uploadFileService } from "../files/file.service";
import { server } from "@/lib/axios";

export const createSimulationService = async (
  clerkUserId: string,
  data: TCreateSimulationSchema,
) => {
  const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

  if (!user || user.length === 0) {
    throw new NotFoundException("User not found");
  }

  const simulation = await createSimulationRepository(user[0].id, data);

  return simulation;
};

export const getSimulationsWithPaginationService = async (
  clerkUserId: string,
  queryParams: TIndexSimulationQueryParams,
): Promise<TPaginationResponse<TSimulation>> => {
  const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

  if (!user || user.length === 0) {
    throw new NotFoundException("User not found");
  }

  const [entries, total] = await Promise.all([
    getSimulationsWithPaginationRepository(user[0].id, queryParams),
    getSimulationsCountRepository(user[0].id, queryParams),
  ]);

  return paginationResponseMapper<TSimulation>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getSimulationByIdService = async (simulationId: string) => {
  const simulation = await getSimulationByIdRepository(simulationId);

  if (!simulation || simulation.length === 0) {
    throw new NotFoundException("Simulation not found");
  }

  return simulation[0];
};

export const uploadSimulationFileService = async (
  clerkUserId: string,
  simulationId: string,
  file: File,
) => {
  const user = await findCurrentUserByClerkUserIdService(clerkUserId);

  const simulation = await getSimulationByIdService(simulationId);

  const minioUploadedFile = await uploadFileService(file, `dataset/raw/${simulationId}`);

  const uploadedFile = await createSimulationUploadedFileRepository({
    fileName: minioUploadedFile.fileName,
    filePath: minioUploadedFile.filePath,
    userId: user.id,
  });

  const updatedSimulation = await updateSimulationRepository(simulation.id, {
    uploadId: uploadedFile[0].id,
  });

  try {
    await server.post(`/simulations/${simulationId}/files`);
  } catch {
    await updateSimulationUploadedFileRepository(uploadedFile[0].id, {
      status: "failed",
    });

    await updateSimulationRepository(simulation.id, {
      uploadId: null,
    });
  }

  return updatedSimulation;
};

export const getSimulationUploadedFileBySimulationIdService = async (
  simulationId: string,
): Promise<TSimulationWithUploadedFile> => {
  const simulation = await getSimulationByIdService(simulationId);

  if (!simulation.uploadId) {
    throw new NotFoundException("No file uploaded for this simulation");
  }

  const uploadedFile = await getSimulationUploadedFileBySimulationIdRepository(simulationId);

  if (!uploadedFile || uploadedFile.length === 0) {
    throw new NotFoundException("Uploaded file not found");
  }

  return {
    ...uploadedFile[0].simulations,
    uploadedFile: {
      ...uploadedFile[0].simulation_uploaded_files,
    },
  };
};
