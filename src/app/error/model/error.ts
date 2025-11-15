import { APP_ERROR_ENUM } from "@/shared/enum/error";
import type { AppError } from "@/shared/types/error";

// Custom Error
export class CustomError extends Error implements AppError {
  code?: number;
  error: APP_ERROR_ENUM;

  constructor(message: string, code?: number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.error = APP_ERROR_ENUM.UNKNOWN_ERROR;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  getStatusCode(): number | undefined {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }

  getError(): APP_ERROR_ENUM {
    return this.error;
  }
}
export class PageNotFound extends CustomError {
  constructor() {
    super("Page Not Found", 404);
    this.error = APP_ERROR_ENUM.NOT_FOUND;
  }
}
export class UnhandledRejectionError extends CustomError {
  constructor(message: string) {
    super(message);
    this.error = APP_ERROR_ENUM.PROMISE_REJECTION;
  }
}
