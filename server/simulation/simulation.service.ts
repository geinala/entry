import "server-only";

import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { findCurrentUserByClerkUserIdRepository } from "../user/user.repository";
import { NotFoundException } from "@/common/exception/not-found.exception";
import {
  deleteSimulationWithRelationsRepository,
  getSimulationByIdRepository,
  getSimulationsCountRepository,
  getSimulationsWithPaginationRepository,
} from "./simulation.repository";
import { TPaginationResponse } from "@/types/meta";
import { TSimulation, TSimulationWithDepot } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";

export const getSimulationsWithPaginationService = async (
  clerkUserId: string,
  queryParams: TIndexSimulationQueryParams,
): Promise<TPaginationResponse<TSimulation>> => {
  const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const [entries, total] = await Promise.all([
    getSimulationsWithPaginationRepository(user.userId, queryParams),
    getSimulationsCountRepository(user.userId, queryParams),
  ]);

  return paginationResponseMapper<TSimulation>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getSimulationByIdService = async (
  simulationId: string,
): Promise<TSimulationWithDepot> => {
  const simulation = await getSimulationByIdRepository(simulationId);

  if (!simulation || simulation.length === 0) {
    throw new NotFoundException("Simulation not found");
  }

  return {
    ...simulation[0].simulations,
    depot: simulation[0].nodes ?? null,
  };
};

export const deleteSimulationByIdService = async (clerkUserId: string, simulationId: string) => {
  const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const deletedSimulation = await deleteSimulationWithRelationsRepository(simulationId, user.userId);

  if (!deletedSimulation) {
    throw new NotFoundException("Simulation not found");
  }

  return deletedSimulation;
};
