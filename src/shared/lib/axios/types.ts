import type { APP_ERROR_ENUM } from "@/shared/enum/error";
import type { AppError, ErrorResponse } from "@/shared/types/error";
import type { AxiosError } from "axios";

// Axios Error
export class CustomAxiosAppError implements AppError {
  constructor(private error: AxiosError) {}

  getStatusCode(): number | string | undefined {
    if (typeof this.error.code === "string") {
      return this.error.code as string;
    }
    return this.error.response?.status;
  }

  getMessage(): string {
    return (
      (this.error.response?.data as ErrorResponse)?.message || this.error.message || "Network error"
    );
  }

  getError(): APP_ERROR_ENUM {
    return (this.error.response?.data as ErrorResponse)?.error;
  }
}
