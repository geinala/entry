import { mapError, mapErrorToEnum } from "./mapper";
import type { AppError } from "@/shared/types/error";
import { ERROR_MESSAGES } from "./const";
import { appConfig } from "@/config/app";

export const errorHandler = (error: AppError) => {
  const isDev = appConfig.env === "development";

  const userMessage = error ? ERROR_MESSAGES[mapErrorToEnum(error)] : "Something went wrong";

  const mappedError = mapError(error);

  return {
    statusCode: typeof mappedError.statusCode === "string" ? undefined : mappedError.statusCode,
    message: isDev ? mappedError.message : userMessage,
  };
};
