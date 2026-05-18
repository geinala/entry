import { Button } from "@/app/_components/ui/button";
import { useUpdateSimulationJobMutation } from "../../../../_hooks/use-mutations";
import { ContinueConfirmationDialog } from "../dialog/continue-confirmation.dialog";
import { useState } from "react";

interface IProps {
  jobId: string;
  currentStep: number;
  disabled?: boolean;
}

export const ContinueToRouteOptimizationButton = ({ jobId, currentStep, disabled }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateSimulationJobMutation();

  return (
    <>
      <Button
        disabled={disabled || isPending}
        onClick={async () => {
          setIsDialogOpen(true);
        }}
      >
        Revalidate and Continue
      </Button>

      <ContinueConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isLoading={isPending}
        onConfirm={async () => {
          await mutateAsync({
            simulationJobId: jobId,
            payload: { currentStep, geocodingStatus: "completed" },
          });
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};
