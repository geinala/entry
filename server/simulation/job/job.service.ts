import "server-only";

import { BadRequestException } from "@/common/exception/bad-request.exception";
import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { uploadFileService } from "@/server/files/file.service";
import {
  createSimulationJobRepository,
  getSimulationBySimulationJobIdRepository,
  getSimulationJobsByUserIdAndStatusRepository,
  updateSimulationJobRepository,
  updateSimulationJobStatusRepository,
} from "./job.repository";
import { server } from "@/lib/axios";
import { TSimulationJobStatusSchema } from "@/schemas/simulations/jobs/job-status.schema";
import { TUpdateSimulationJobSchema } from "@/schemas/simulations/jobs/update-simulation-job.schema";
import { InternalServerErrorException } from "@/common/exception/internal_server_error.exception";

const EXPECTED_CUSTOMER_TEMPLATE_HEADERS = [
  "Nosi",
  "Start_Datetime",
  "End_Datetime",
  "Courier",
  "Customer_Name",
  "Address",
  "City",
  "Weight",
];

const normalizeCsvValue = (value: string) => value.replace(/^\uFEFF/, "").trim();

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];

      if (insideQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
        continue;
      }

      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(normalizeCsvValue(currentValue));
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(normalizeCsvValue(currentValue));

  return values;
};

const getCsvLines = (content: string) => {
  return content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const validateCustomersFileTemplate = (content: string) => {
  const [headerLine] = getCsvLines(content);

  if (!headerLine) {
    throw new BadRequestException(
      "Customers file does not match the template. Please use the downloaded template.",
    );
  }

  const headers = parseCsvLine(headerLine);
  const isTemplateMatch =
    headers.length === EXPECTED_CUSTOMER_TEMPLATE_HEADERS.length &&
    headers.every((header, index) => header === EXPECTED_CUSTOMER_TEMPLATE_HEADERS[index]);

  if (!isTemplateMatch) {
    throw new BadRequestException(
      "Customers file does not match the template. Please use the downloaded template.",
    );
  }
};

const countCsvRowsFromContent = (content: string) => {
  const lines = getCsvLines(content);

  if (lines.length <= 1) {
    return 0;
  }

  return lines.length - 1;
};

export const createSimulationJobService = async (
  clerkUserId: string,
  data: TCreateSimulationJobSchema,
) => {
  const fileContent = await data.customersFile.text();

  validateCustomersFileTemplate(fileContent);

  const fileTotalRows = countCsvRowsFromContent(fileContent);
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
    updatedJob.fileValidationCompletedAt
  ) {
    try {
      await server.post(`/simulations/jobs/${simulationJobId}/process`);
    } catch (error) {
      await updateSimulationJobStatusRepository(simulationJobId, {
        status: "failed",
      });
      throw error;
    }
  }

  return updatedJob;
};

export const startOptimizationProcessService = async (clerkUserId: string) => {
  const simulationJob = await getSimulationJobsByUserIdAndStatusRepository(clerkUserId);

  if (!simulationJob) {
    throw new InternalServerErrorException("Simulation job not found");
  }

  const simulation = await getSimulationBySimulationJobIdRepository(simulationJob.id);

  if (!simulation) {
    throw new InternalServerErrorException("Associated simulation not found");
  }

  try {
    await server.post(`/optimizations/${simulation.id}`);
  } catch {
    await updateSimulationJobRepository(simulationJob.id, {
      status: "failed",
    });
    throw new InternalServerErrorException("Failed to start optimization process");
  }

  await updateSimulationJobRepository(simulationJob.id, {
    status: "completed",
  });

  return simulation.id;
};
