import "server-only";

import { validateSchema } from "@/lib/validation";
import {
  CreateSimulationJobSchema,
  TCreateSimulationJobSchema,
} from "@/schemas/simulations/create-simulation.schema";
import { NextRequest } from "next/server";
import { createSimulationJobService } from "./simulation-job.service";
import { responseFormatter } from "@/lib/response-formatter";
import { handleException } from "@/common/exception/helper";

export const createSimulationJobController = async (request: NextRequest, clerkUserId: string) => {
  try {
    const formData = await request.formData();

    const payload = {
      depotLocationAddress: formData.get("depotLocationAddress") as string,
      depotLongitude: Number(formData.get("depotLongitude")),
      depotLatitude: Number(formData.get("depotLatitude")),
      title: formData.get("title") as string,
      computationTimeLimit: Number(formData.get("computationTimeLimit")),
      customersFile: formData.get("customersFile") as File,
      startDatetime: formData.get("startDatetime") as string,
    };

    const { data } = validateSchema<TCreateSimulationJobSchema>(CreateSimulationJobSchema, payload);

    const createdSimulation = await createSimulationJobService(clerkUserId, data);

    return responseFormatter.created({
      data: createdSimulation[0],
      message: "Simulation job created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
