import { Button } from "@/app/_components/ui/button";
import { useUpdateSimulationJobMutation } from "../../../../_hooks/use-mutations";
import { ContinueConfirmationDialog } from "../dialog/continue-confirmation.dialog";
import { useState } from "react";

interface IProps {
  jobId: string;
  currentStep: number;
  disabled?: boolean;
}

export const ContinueToCleaningDataButton = ({ jobId, currentStep, disabled }: IProps) => {
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
        Continue to Cleaning Data
      </Button>

      <ContinueConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isLoading={isPending}
        onConfirm={async () => {
          await mutateAsync({
            simulationJobId: jobId,
            payload: { currentStep: currentStep + 1, fileValidationStatus: "completed" },
          });
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};
