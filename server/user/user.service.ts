import { IndexQueryParamsType } from "@/types/query-params";
import {
  findUserByClerkIdRepository,
  findUserWithRoleAndPermissionsRepository,
  getUsersCountRepository,
  getUsersWithPaginationRepository,
} from "./user.repository";
import { UserType } from "./user.types";
import { paginationResponseMapper } from "@/lib/pagination";
import { User } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";

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

export const findUserWithRoleAndPermissionsService = async (clerkUserId: string) => {
  try {
    const userDetails = await findUserWithRoleAndPermissionsRepository(clerkUserId);

    if (!userDetails || userDetails.length === 0) {
      return null;
    }

    const { users, roles } = userDetails[0];

    return {
      user: users,
      role: roles,
      permissions: userDetails.map((r) => r.permissions).filter(Boolean),
    };
  } catch (error) {
    throw error;
  }
};

export const getUsersWithPaginationService = async (
  queryParams: IndexQueryParamsType,
): Promise<TPaginationResponse<User[]>> => {
  try {
    const [users, total] = await Promise.all([
      getUsersWithPaginationRepository(queryParams),
      getUsersCountRepository(queryParams),
    ]);

    return paginationResponseMapper<User>(users, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: total,
    });
  } catch (error) {
    throw error;
  }
};
