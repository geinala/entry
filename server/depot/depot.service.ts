import "server-only";

import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCreateOrUpdateDepotSchema, TIndexDepotQueryParams } from "@/schemas/depot.schema";
import { TDepot } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import {
  createDepotRepository,
  deleteDepotRepository,
  getDepotByIdRepository,
  getDepotsCountRepository,
  getDepotsWithPaginationRepository,
  updateDepotRepository,
} from "./depot.repository";

export const getDepotsWithPaginationService = async (
  queryParams: TIndexDepotQueryParams,
): Promise<TPaginationResponse<TDepot>> => {
  const [depots, total] = await Promise.all([
    getDepotsWithPaginationRepository(queryParams),
    getDepotsCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TDepot>(depots, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getDepotByIdService = async (id: number): Promise<TDepot> => {
  const depot = await getDepotByIdRepository(id);

  if (!depot) {
    throw new NotFoundException("Depot not found");
  }

  return depot;
};

export const createDepotService = async (data: TCreateOrUpdateDepotSchema): Promise<TDepot> => {
  return await createDepotRepository(data);
};

export const updateDepotService = async (
  id: number,
  data: TCreateOrUpdateDepotSchema,
): Promise<TDepot> => {
  const depot = await updateDepotRepository(id, data);

  if (!depot) {
    throw new NotFoundException("Depot not found");
  }

  return depot;
};

export const deleteDepotService = async (id: number): Promise<TDepot> => {
  const depot = await deleteDepotRepository(id);

  if (!depot) {
    throw new NotFoundException("Depot not found");
  }

  return depot;
};