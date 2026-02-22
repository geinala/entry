import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { parseSortParams } from "@/lib/query-param";
import { parseQueryParams } from "@/lib/validation";
import { IndexRoleQueryParams } from "@/schemas/role.schema";
import { getRolesWithPaginationService } from "./role.service";
import { TRole } from "@/types/database";

export const getRolesWithPaginationController = async (
  clerkUserId: string,
  request: NextRequest,
) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_ROLE]);

    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(IndexRoleQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getRolesWithPaginationService(queryParams);

    return responseFormatter.successWithPagination<TRole>({
      data,
      meta,
      message: "Roles retrieved successfully",
    });
  } catch {
    return responseFormatter.error({
      message: "Failed to retrieve roles",
    });
  }
};
