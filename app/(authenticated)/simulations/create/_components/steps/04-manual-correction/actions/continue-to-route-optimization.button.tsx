import { Button } from "@/app/_components/ui/button";
import { useRevalidateAddressRowMutation } from "../../../../_hooks/use-mutations";
import { ContinueConfirmationDialog } from "../dialog/continue-confirmation.dialog";
import { useState } from "react";

interface IProps {
  jobId: string;
  disabled?: boolean;
}

export const ContinueToRouteOptimizationButton = ({ jobId, disabled }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useRevalidateAddressRowMutation();

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
            jobId,
          });
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};
