import { TCreateSimulationSchema } from "@/schemas/simulation.schema";
import { findCurrentUserByClerkUserIdRepository } from "../user/user.repository";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { createSimulationRepository } from "./simulation.repository";

export const createSimulationService = async (
  clerkUserId: string,
  data: TCreateSimulationSchema,
) => {
  try {
    const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

    if (!user || user.length === 0) {
      throw new NotFoundException("User not found");
    }

    const simulation = await createSimulationRepository(user[0].id, data);

    return simulation;
  } catch (error) {
    throw error;
  }
};
