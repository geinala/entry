import { isAxiosError } from "axios";
import { extractAxiosErrorResponse } from "../utils/mapper";
import { useToast } from "./use-toast";

export const useErrorToast = () => {
  const { showToast } = useToast();

  const showError = (error: unknown) => {
    if (isAxiosError(error)) {
      const errors = extractAxiosErrorResponse(error);

      if (Array.isArray(errors)) {
        showToast(errors.join(", "), "error");
      } else {
        showToast(errors, "error");
      }
    } else if (error instanceof Error) {
      showToast(error.message ?? "Error occurred", "error");
    } else {
      showToast("An unexpected error occurred", "error");
    }
  };

  return { showError };
};
