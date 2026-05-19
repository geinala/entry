import { Button } from "@/app/_components/ui/button";
import { useStartOptimizationProcessMutation } from "../../../../_hooks/use-mutations";

export const ProcessToOptimizationButton = () => {
  const { mutateAsync, isPending } = useStartOptimizationProcessMutation();

  return (
    <Button
      onClick={async () => {
        await mutateAsync();
      }}
      disabled={isPending}
      isLoading={isPending}
    >
      Proceed to Route Optimization
    </Button>
  );
};
