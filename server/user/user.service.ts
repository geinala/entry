import "server-only";

import {
  findUserByClerkIdRepository,
  findUserWithRoleAndPermissionsRepository,
  getUsersCountRepository,
  getUsersWithPaginationRepository,
} from "./user.repository";
import { UserType } from "./user.types";
import { paginationResponseMapper } from "@/lib/pagination";
import { TUser, TUserWithRoleAndPermissionNames } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TGetUsersQueryParams } from "@/schemas/user.schema";

export const validateUserService = async (clerkUserId: string) => {
  try {
    const user = await findUserByClerkIdRepository(clerkUserId);

    if (!user || user.length === 0) {
      return null;
    }

    if (user) {
      return {
        type: UserType.EXISTING_USER,
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
};

export const findUserWithRoleAndPermissionsService = async (
  clerkUserId: string,
): Promise<TUserWithRoleAndPermissionNames | null> => {
  const userDetails = await findUserWithRoleAndPermissionsRepository(clerkUserId);

  if (!userDetails || userDetails.length === 0) {
    return null;
  }

  const firstRow = userDetails[0];
  if (!firstRow?.users || !firstRow?.roles) {
    return null;
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
  try {
    const [users, total] = await Promise.all([
      getUsersWithPaginationRepository(queryParams),
      getUsersCountRepository(queryParams),
    ]);

    return paginationResponseMapper<TUser>(users, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: total,
    });
  } catch (error) {
    throw error;
  }
};
