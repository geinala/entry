import "server-only";

import {
  findCurrentUserByClerkUserIdRepository,
  findUserWithRoleAndPermissionsRepository,
  getUsersCountRepository,
  getUsersWithPaginationRepository,
} from "./user.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TUser, TUserWithRoleAndPermissionNames } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TGetUsersQueryParams } from "@/schemas/user.schema";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const findCurrentUserByClerkUserIdService = async (clerkUserId: string) => {
  const user = await findCurrentUserByClerkUserIdRepository(clerkUserId);

  if (!user || user.length === 0) {
    throw new NotFoundException("User not found");
  }

  return user[0];
};

export const findUserWithRoleAndPermissionsService = async (
  clerkUserId: string,
): Promise<TUserWithRoleAndPermissionNames | null> => {
  const userDetails = await findUserWithRoleAndPermissionsRepository(clerkUserId);

  if (!userDetails || userDetails.length === 0) {
    throw new NotFoundException("User not found");
  }

  const firstRow = userDetails[0];

  if (!firstRow?.users || !firstRow?.roles) {
    throw new NotFoundException("User or role information is incomplete");
  }

  const permissionNames = Array.from(
    new Set(
      userDetails
        .map((row) => row.permissions?.name)
        .filter((name): name is string => name !== null && name !== undefined),
    ),
  );

  return {
    ...firstRow.users,
    role: firstRow.roles.name,
    permissions: permissionNames,
  };
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
