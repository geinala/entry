import { useErrorStore } from "@/shared/stores/error.store";
import { captureException as SentryCaptureException } from "@sentry/browser";
import { useEffect } from "react";
import { CustomError, UnhandledRejectionError } from "../model/error";

export const GlobalErrorListener = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      SentryCaptureException(event.error);
      useErrorStore.getState().setError(new CustomError(event.error.message));
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      SentryCaptureException(event.reason);
      useErrorStore.getState().setError(new UnhandledRejectionError(String(event.reason)));
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
};
