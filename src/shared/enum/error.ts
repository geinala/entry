export enum APP_ERROR_ENUM {
  // HTTP
  INTERNAL_SERVER_ERROR = "InternalServerError",
  NOT_FOUND = "NotFound",
  CONFLICT = "Conflict",
  BAD_REQUEST = "BadRequest",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  TOO_MANY_REQUESTS = "TooManyRequests",
  UNPROCESSABLE_ENTITY = "UnprocessableEntity",
  ZOD_VALIDATION = "ZodValidationException",

  // Non-HTTP / frontend
  NETWORK_ERROR = "NetworkError",
  TIMEOUT_ERROR = "TimeoutError",
  PROMISE_REJECTION = "PromiseRejection",
  UNKNOWN_ERROR = "UnknownError",
}
