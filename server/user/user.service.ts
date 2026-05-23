import "server-only";

import { findCurrentUserByIdRepository, getUsersWithPaginationRepository } from "./user.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TUser } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { TUserIndexQueryParams } from "@/schemas/user.schema";

export const findCurrentUserByIdService = async (id: string) => {
  const user = await findCurrentUserByIdRepository(id);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
};

export const getUsersWithPaginationService = async (
  queryParams: TUserIndexQueryParams,
): Promise<TPaginationResponse<TUser>> => {
  const [users, total] = await getUsersWithPaginationRepository(queryParams);

  return paginationResponseMapper<TUser>(users, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};
