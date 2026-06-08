import "server-only";

import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TTuningExperimentDataset } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import {
  createParameterRepository,
  getParameterByIdRepository,
  getParametersCountRepository,
  getParametersWithPaginationRepository,
  updateTuningExperminetDatasetStatusRepository,
} from "./parameter.repository";
import { TCreateParameterSchema, TIndexParameterQueryParams } from "@/schemas/parameter.schema";
import { validateFileTemplate } from "@/lib/utils";
import { uploadFileService } from "../files/file.service";
import { server } from "@/lib/axios";

export const getParametersWithPaginationService = async (
  queryParams: TIndexParameterQueryParams,
): Promise<TPaginationResponse<TTuningExperimentDataset>> => {
  const [parameters, total] = await Promise.all([
    getParametersWithPaginationRepository(queryParams),
    getParametersCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TTuningExperimentDataset>(parameters, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getParameterByIdService = async (id: string): Promise<TTuningExperimentDataset> => {
  const parameter = await getParameterByIdRepository(id);

  if (!parameter) {
    throw new NotFoundException("Parameter not found");
  }

  return parameter;
};

export const createParameterService = async (
  data: TCreateParameterSchema,
): Promise<TTuningExperimentDataset> => {
  const fileContent = await data.dataset.text();

  validateFileTemplate(fileContent);

  const minioUploadedFile = await uploadFileService(data.dataset, `dataset/raw`);

  const result = await createParameterRepository(minioUploadedFile.filePath);

  try {
    await server.post(`/tuning-experiments/${result.id}`);
  } catch {
    await updateTuningExperminetDatasetStatusRepository({
      status: "failed",
      tuningExperimentDatasetId: result.id,
    });
  }

  return result;
};
