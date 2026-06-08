import "server-only";

import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { NextRequest } from "next/server";
import {
  createParameterService,
  getParameterByIdService,
  getParametersWithPaginationService,
} from "./parameter.service";
import {
  CreateParameterSchema,
  IndexParameterQueryParams,
  TCreateParameterSchema,
} from "@/schemas/parameter.schema";

export const createParameterController = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const payload: TCreateParameterSchema = {
      dataset: formData.get("dataset") as File,
    };

    const { data } = validateSchema<TCreateParameterSchema>(CreateParameterSchema, payload);

    const parameter = await createParameterService(data);

    return responseFormatter.created({
      data: parameter,
      message: "Parameter created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getParametersWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(IndexParameterQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const { data, meta } = await getParametersWithPaginationService(result.data);

    return responseFormatter.successWithPagination({
      data,
      meta,
      message: "Parameters retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getParameterByIdController = async (id: string) => {
  try {
    const parameter = await getParameterByIdService(id);

    return responseFormatter.successWithData({
      data: parameter,
      message: "Parameter retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
