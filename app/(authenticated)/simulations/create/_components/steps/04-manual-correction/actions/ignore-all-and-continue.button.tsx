"use client";

import { Button } from "@/app/_components/ui/button";
import { useIgnoreAllErrorsAddressAndContinueMutation } from "../../../../_hooks/use-mutations";
import { IgnoreConfirmationDialog } from "../dialog/ignore-confirmation.dialog";
import { ButtonHTMLAttributes, useState } from "react";

interface IProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  jobId: string;
}

export const IgnoreAllAndContinueButton = ({ jobId, disabled }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useIgnoreAllErrorsAddressAndContinueMutation();

  return (
    <>
      <Button
        variant={"outline"}
        disabled={disabled || isPending}
        onClick={() => setIsDialogOpen(true)}
      >
        Ignore all and continue
      </Button>

      <IgnoreConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={async () => {
          await mutateAsync(jobId);
          setIsDialogOpen(false);
        }}
        isLoading={isPending}
        title="Ignore all and continue"
        description="All error rows will be ignored before continuing the process."
      />
    </>
  );
};
