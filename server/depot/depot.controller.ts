import "server-only";

import { handleException } from "@/common/exception/helper";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import {
  CreateOrUpdateDepotSchema,
  DepotIdParamSchema,
  TCreateOrUpdateDepotSchema,
  TDepotIdParamSchema,
} from "@/schemas/depot.schema";
import { NextRequest } from "next/server";
import {
  createDepotService,
  deleteDepotService,
  getDepotByIdService,
  getDepotOptionsService,
  getDepotsWithPaginationService,
  updateDepotService,
} from "./depot.service";
import { IndexQueryParams } from "@/types/query-params";

export const createDepotController = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = validateSchema<TCreateOrUpdateDepotSchema>(CreateOrUpdateDepotSchema, body);

    const depot = await createDepotService(result.data);

    return responseFormatter.created({
      data: depot,
      message: "Depot created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateDepotController = async (request: NextRequest, id: number) => {
  try {
    const body = await request.json();

    const result = validateSchema<TCreateOrUpdateDepotSchema>(CreateOrUpdateDepotSchema, body);

    const depot = await updateDepotService(id, result.data);

    return responseFormatter.successWithData({
      data: depot,
      message: "Depot updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteDepotController = async (request: NextRequest, id: number) => {
  try {
    await deleteDepotService(id);

    return responseFormatter.deleted({ message: "Depot deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getDepotsWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(IndexQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const { data, meta } = await getDepotsWithPaginationService(result.data);

    return responseFormatter.successWithPagination({
      data,
      meta,
      message: "Depots retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getDepotByIdController = async (request: NextRequest, id: number) => {
  try {
    const result = validateSchema<TDepotIdParamSchema>(
      DepotIdParamSchema,
      { depotId: id },
      () => new NotFoundException("Depot not found"),
    );

    const depot = await getDepotByIdService(result.data.depotId);

    return responseFormatter.successWithData({
      data: depot,
      message: "Depot retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getDepotOptionsController = async (_request: NextRequest) => {
  try {
    const depotOptions = await getDepotOptionsService();

    return responseFormatter.successWithData({
      data: depotOptions,
      message: "Depot options retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
