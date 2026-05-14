"use client";

import { Button } from "@/app/_components/ui/button";
import { useDeleteAllSimulationUploadedErrorsAndContinueMutation } from "../../../../_hooks/use-mutations";
import { DeleteConfirmationDialog } from "../dialog/delete-confirmation.dialog";
import { ButtonHTMLAttributes, useState } from "react";

interface IProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  jobId: string;
}

export const DeleteAllAndContinueButton = ({ jobId, disabled }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteAllSimulationUploadedErrorsAndContinueMutation();

  return (
    <>
      <Button
        variant={"outline"}
        disabled={disabled || isPending}
        onClick={() => setIsDialogOpen(true)}
      >
        Delete All Errors and Continue
      </Button>

      <DeleteConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={async () => {
          await mutateAsync(jobId);
          setIsDialogOpen(false);
        }}
        isLoading={isPending}
        title="Delete All Errors and Continue"
        description="All error rows will be permanently removed before continuing the process."
      />
    </>
  );
};
