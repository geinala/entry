import type { ErrorResponse, TDetailError } from "../types/error";
import { APP_ERROR_ENUM } from "../enum/error";
import type { AxiosError } from "axios";
import { capitalize } from "./string";

export const extractAxiosErrorResponse = (error: AxiosError): string | string[] => {
  const { error: errorData, details } = error.response?.data as ErrorResponse;

  if (errorData === APP_ERROR_ENUM.ZOD_VALIDATION && Array.isArray(details)) {
    return details.map((detail: TDetailError) => {
      const message = typeof detail.message === "string" ? detail.message.toLowerCase() : "";
      return `${capitalize(detail.field)} ${message}`;
    });
  }

  return error.message;
};
