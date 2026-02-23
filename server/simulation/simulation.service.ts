import { TCreateSimulationSchema, TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { findCurrentUserByClerkUserIdRepository } from "../user/user.repository";
import { NotFoundException } from "@/common/exception/not-found.exception";
import {
  createSimulationRepository,
  getSimulationsCountRepository,
  getSimulationsWithPaginationRepository,
} from "./simulation.repository";
import { TPaginationResponse } from "@/types/meta";
import { TSimulation } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";

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
