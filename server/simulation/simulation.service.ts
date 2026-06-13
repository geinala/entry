import "server-only";

import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { findCurrentUserByIdRepository } from "../user/user.repository";
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
  const user = await findCurrentUserByIdRepository(clerkUserId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const [entries, total] = await Promise.all([
    getSimulationsWithPaginationRepository(user.id, {
      ...queryParams,
      sort: [{ direction: "desc", key: "createdAt" }],
    }),
    getSimulationsCountRepository(user.id, queryParams),
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

  return {
    ...simulation.simulations,
    depot: simulation.depots,
  };
};

export const deleteSimulationByIdService = async (clerkUserId: string, simulationId: string) => {
  const user = await findCurrentUserByIdRepository(clerkUserId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const deletedSimulation = await deleteSimulationWithRelationsRepository(simulationId, user.id);

  if (!deletedSimulation) {
    throw new NotFoundException("Simulation not found");
  }

  return deletedSimulation;
};
