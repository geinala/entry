import { BaseException } from "@/common/exception/base.exception";
import { responseFormatter } from "@/lib/response-formatter";
import { validateSchema } from "@/lib/validation";
import { CreateSimulationSchema } from "@/schemas/simulation.schema";
import { NextRequest } from "next/server";
import { createSimulationService } from "./simulation.service";

export const createSimulationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    const body = await request.json();

    const result = validateSchema(CreateSimulationSchema, body);

    if (!result.success && result.error) {
      return responseFormatter.validationError({
        message: "Invalid request body",
        error: result.error,
      });
    }

    const createdSimulation = await createSimulationService(clerkUserId, result.data);

    return responseFormatter.created({
      data: createdSimulation,
      message: "Simulation created successfully",
    });
  } catch (error) {
    if (error instanceof BaseException) {
      return responseFormatter.error({ message: error.message, status: error.statusCode });
    }

    return responseFormatter.error({ message: "Failed to create simulation" });
  }
};
