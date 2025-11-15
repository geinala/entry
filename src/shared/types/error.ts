import type { APP_ERROR_ENUM } from "../enum/error";

export interface AppError {
  getStatusCode(): number | string | undefined;
  getMessage(): string;
  getError(): APP_ERROR_ENUM;
}

export interface ErrorResponse {
  statusCode: number | string | undefined;
  message: string;
  error: APP_ERROR_ENUM;
  details?: TDetailError[];
}

export type TDetailError = {
  code: string;
  field: string;
  message: string;
};
