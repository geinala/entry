import { type FC, type PropsWithChildren } from "react";
import { Centered } from "@/shared/ui/centered";
import { Button } from "@/shared/ui/button";
import "./styles.css";
import type { AppError } from "@/shared/types/error";
import { CustomAxiosAppError } from "@/shared/lib/axios/types";
import { PageNotFound } from "../model/error";

interface IErrorBoundaryProps extends PropsWithChildren {
  error: AppError | null;
  statusCode?: number | string;
  message?: string;
  onReset: () => void;
}

export const ErrorBoundary: FC<IErrorBoundaryProps> = ({
  children,
  error,
  statusCode,
  message,
  onReset,
}) => {
  const processedMessage =
    error instanceof CustomAxiosAppError || PageNotFound ? message : "Something went wrong";

  if (!error) {
    return <>{children}</>;
  }

  return (
    <Centered isFullScreen className="relative overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-80 background">
        <h1 className="md:text-[18rem]/228 font-bold -z-10 text-[8rem] text-destructive">
          {!statusCode && "ERROR"}
          {statusCode && typeof statusCode === "string" ? "ERROR" : statusCode}
        </h1>
      </div>

      <div className="relative flex flex-col text-center items-center justify-end gap-3 h-full z-20 max-w-lg max-h-80 p-3">
        <h1 className="text-5xl font-bold md:text-7xl">Oops!</h1>
        <p className="lg:text-xl">{processedMessage}</p>
        <Button onClick={onReset}>Back</Button>
      </div>
    </Centered>
  );
};
