import "server-only";

import { validateSchema } from "@/lib/validation";
import {
  CreateSimulationJobSchema,
  TCreateSimulationJobInput,
  TCreateSimulationJobSchema,
} from "@/schemas/simulations/create-simulation.schema";
import { NextRequest } from "next/server";
import {
  createSimulationJobService,
  getSimulationJobsByUserIdAndStatusService,
  startOptimizationProcessService,
  updateSimulationJobService,
} from "./job.service";
import { responseFormatter } from "@/lib/response-formatter";
import { handleException } from "@/common/exception/helper";
import {
  SimulationJobStatusSchema,
  TSimulationJobStatusSchema,
} from "@/schemas/simulations/jobs/job-status.schema";
import { NotFoundException } from "@/common/exception/not-found.exception";
import {
  TUpdateSimulationJobSchema,
  UpdateSimulationJobSchema,
} from "@/schemas/simulations/jobs/update-simulation-job.schema";

export const createSimulationJobController = async (request: NextRequest, clerkUserId: string) => {
  try {
    const formData = await request.formData();

    const payload: TCreateSimulationJobSchema = {
      depotLocationAddress: formData.get("depotLocationAddress") as string,
      depotLongitude: Number(formData.get("depotLongitude")),
      depotLatitude: Number(formData.get("depotLatitude")),
      title: formData.get("title") as string,
      computationTimeLimit: Number(formData.get("computationTimeLimit")),
      customersFile: formData.get("customersFile") as File,
      startDatetime: formData.get("startDatetime") as string,
      depotId: Number(formData.get("depotId")),
      algorithm: formData.get("algorithm") as TCreateSimulationJobInput["algorithm"],
      congestionDelayThresholdInSeconds: Number(formData.get("congestionDelayThresholdInSeconds")),
      resequenceImprovementThresholdPercent: Number(
        formData.get("resequenceImprovementThresholdPercent"),
      ),
    };

    const { data } = validateSchema<TCreateSimulationJobSchema>(CreateSimulationJobSchema, payload);

    const createdSimulation = await createSimulationJobService(clerkUserId, data);

    return responseFormatter.created({
      data: createdSimulation,
      message: "Simulation job created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSimulationJobsByUserIdAndStatusController = async (
  request: NextRequest,
  clerkUserId: string,
) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const excludeStatus = searchParams
      .getAll("excludeStatus")
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);

    const { data } = validateSchema<TSimulationJobStatusSchema>(
      SimulationJobStatusSchema,
      { status, excludeStatus },
      () => {
        throw new NotFoundException("Invalid simulation job status");
      },
    );

    const simulationJobs = await getSimulationJobsByUserIdAndStatusService(
      clerkUserId,
      data.status,
      data.excludeStatus,
    );

    if (!simulationJobs) {
      return responseFormatter.noContent();
    }

    return responseFormatter.successWithData({
      data: simulationJobs,
      message: "Simulation jobs retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateSimulationJobController = async (
  request: NextRequest,
  simulationJobId: string,
) => {
  try {
    const body = await request.json();

    const { data } = validateSchema<TUpdateSimulationJobSchema>(UpdateSimulationJobSchema, body);

    const result = await updateSimulationJobService(simulationJobId, data);

    return responseFormatter.successWithData({
      data: result,
      message: "Simulation job updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const startOptimizationProcessController = async (clerkUserId: string) => {
  try {
    const result = await startOptimizationProcessService(clerkUserId);

    return responseFormatter.successWithRedirect({
      message: "Route optimization process started successfully",
      redirectUrl: `/simulations/${result}`,
    });
  } catch (error) {
    return handleException(error);
  }
};
