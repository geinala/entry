import { APP_ERROR_ENUM } from "@/shared/enum/error";

export const ERROR_MESSAGES: Record<APP_ERROR_ENUM, string> = {
  [APP_ERROR_ENUM.INTERNAL_SERVER_ERROR]:
    "Sorry, our server is having a hiccup. Hang on, we're working on it!",
  [APP_ERROR_ENUM.NOT_FOUND]: "Page or data not found. Try going back to the main menu!",
  [APP_ERROR_ENUM.CONFLICT]: "There’s a conflict with your data. Check your input and try again!",
  [APP_ERROR_ENUM.BAD_REQUEST]:
    "Something’s wrong with your request. Double-check and give it another shot!",
  [APP_ERROR_ENUM.UNAUTHORIZED]:
    "You need to log in to play this quiz. Sign in and let’s get started!",
  [APP_ERROR_ENUM.FORBIDDEN]:
    "Sorry, you don’t have access to this. Make sure you’re in the right place!",
  [APP_ERROR_ENUM.TOO_MANY_REQUESTS]:
    "Whoa, you’re going too fast! Give our server a moment and try again.",
  [APP_ERROR_ENUM.UNPROCESSABLE_ENTITY]:
    "We can’t process your data. Check your input and try again!",
  [APP_ERROR_ENUM.ZOD_VALIDATION]:
    "There’s an issue with your data. Please review and correct it before proceeding.",

  [APP_ERROR_ENUM.NETWORK_ERROR]:
    "Your internet connection is acting up. Check your network and try again!",
  [APP_ERROR_ENUM.TIMEOUT_ERROR]: "It’s taking too long. Please try again in a moment.",
  [APP_ERROR_ENUM.PROMISE_REJECTION]: "Something went wrong. Give it another try!",
  [APP_ERROR_ENUM.UNKNOWN_ERROR]:
    "Something weird happened. Refresh the page or let us know if it persists!",
};

export const STATUS_CODE_MAPPING: Record<number, APP_ERROR_ENUM> = {
  400: APP_ERROR_ENUM.BAD_REQUEST,
  401: APP_ERROR_ENUM.UNAUTHORIZED,
  403: APP_ERROR_ENUM.FORBIDDEN,
  404: APP_ERROR_ENUM.NOT_FOUND,
  409: APP_ERROR_ENUM.CONFLICT,
  422: APP_ERROR_ENUM.UNPROCESSABLE_ENTITY,
  429: APP_ERROR_ENUM.TOO_MANY_REQUESTS,
  500: APP_ERROR_ENUM.INTERNAL_SERVER_ERROR,
};

export const AXIOS_CODE_MAPPING: Record<string, APP_ERROR_ENUM> = {
  ERR_NETWORK: APP_ERROR_ENUM.NETWORK_ERROR,
  ECONNABORTED: APP_ERROR_ENUM.TIMEOUT_ERROR,
  ETIMEDOUT: APP_ERROR_ENUM.TIMEOUT_ERROR,
  ERR_BAD_OPTION: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_BAD_OPTION_VALUE: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_FR_TOO_MANY_REDIRECTS: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_DEPRECATED: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_BAD_RESPONSE: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_BAD_REQUEST: APP_ERROR_ENUM.BAD_REQUEST,
  ERR_CANCELED: APP_ERROR_ENUM.PROMISE_REJECTION,
  ERR_NOT_SUPPORT: APP_ERROR_ENUM.UNKNOWN_ERROR,
  ERR_INVALID_URL: APP_ERROR_ENUM.BAD_REQUEST,
};
