import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import type { ReactNode } from "react";
import { toast, type ExternalToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

export const useToast = () => {
  const showToast = (message: string, type: ToastType = "info", options?: ExternalToast) => {
    const icons: Record<ToastType, ReactNode> = {
      success: <CircleCheck color="white" fill="green" />,
      info: <Info color="white" fill="blue" />,
      warning: <CircleAlert color="white" fill="orange" />,
      error: <CircleX color="white" fill="red" />,
    };

    toast(message, {
      ...options,
      position: options?.position ?? "top-center",
      duration: options?.duration ?? 3000,
      icon: options?.icon ?? icons[type],
      dismissible: true,
      closeButton: true,
      style: { cursor: "pointer" },
    });
  };

  return { showToast };
};
