import "server-only";

import {
  findCurrentUserByIdRepository,
  getUsersCountRepository,
  getUsersWithPaginationRepository,
} from "./user.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TUser } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TGetUsersQueryParams } from "@/schemas/user.schema";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const findCurrentUserByIdService = async (id: string) => {
  const user = await findCurrentUserByIdRepository(id);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
};

export const getUsersWithPaginationService = async (
  queryParams: TGetUsersQueryParams,
): Promise<TPaginationResponse<TUser>> => {
  const [users, total] = await Promise.all([
    getUsersWithPaginationRepository(queryParams),
    getUsersCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TUser>(users, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};
