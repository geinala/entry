import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { ErrorBoundary } from "../error/ui/error-boundary";
import { useErrorStore } from "@/shared/stores/error.store";
import { errorHandler } from "../error/model/handler";
import { Toaster } from "@/shared/ui/sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  const { error, clearError } = useErrorStore();
  const errorData = error ? errorHandler(error) : null;

  const resetAndRedirect = async () => {
    await router.navigate({ to: "/" });
    clearError();
  };

  return (
    <ErrorBoundary
      error={error}
      message={errorData?.message}
      onReset={resetAndRedirect}
      statusCode={errorData?.statusCode}
    >
      <Outlet />
      <Toaster />
    </ErrorBoundary>
  );
}
