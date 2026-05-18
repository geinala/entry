"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

import { Textarea } from "@/app/_components/ui/textarea";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { useUpdateSimulationUploadedRowMutation } from "../../../../_hooks/use-mutations";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { TSimulationUploadedRow } from "@/types/database";
import { FormEvent, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: TSimulationUploadedRow | null;
  jobId: string;
  defaultValues?: TUpdateSimulationUploadedRowSchema["finalAddress"];
};

export const EditFinalAddressDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedRow,
  jobId,
  defaultValues,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Final Address</DialogTitle>
          <DialogDescription>
            Update this row, then save it to remove it from the error-only list.
          </DialogDescription>
        </DialogHeader>

        {selectedRow && (
          <EditFinalAddressForm
            key={selectedRow.id}
            jobId={jobId}
            selectedRow={selectedRow}
            defaultValue={defaultValues || ""}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

type FormProps = {
  jobId: string;
  selectedRow: TSimulationUploadedRow;
  defaultValue: string;
  onOpenChange: (open: boolean) => void;
};

const EditFinalAddressForm: React.FC<FormProps> = ({
  jobId,
  selectedRow,
  defaultValue,
  onOpenChange,
}) => {
  const { mutateAsync, isPending } = useUpdateSimulationUploadedRowMutation();
  const [finalAddress, setFinalAddress] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const isInvalid = isTouched && finalAddress.trim() === "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTouched(true);

    if (finalAddress.trim() === "") {
      return;
    }

    await mutateAsync({
      jobId,
      rowId: selectedRow.id,
      payload: {
        nosi: selectedRow.nosi ?? "",
        courier: selectedRow.courier ?? "",
        customerName: selectedRow.customerName ?? "",
        address: selectedRow.address ?? "",
        city: selectedRow.city ?? "",
        weight: Number(selectedRow.weight ?? 0),
        finalAddress: finalAddress.trim(),
        resolutionStatus: "manual_override",
        startDatetime:
          selectedRow.startDatetime instanceof Date
            ? selectedRow.startDatetime.toISOString()
            : String(selectedRow.startDatetime),
        endDatetime:
          selectedRow.endDatetime instanceof Date
            ? selectedRow.endDatetime.toISOString()
            : String(selectedRow.endDatetime),
      },
    });

    onOpenChange(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} id="edit-final-address-form">
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="finalAddress">Final Address</FieldLabel>

        <Textarea
          id="finalAddress"
          name="finalAddress"
          value={finalAddress}
          onBlur={() => setIsTouched(true)}
          onChange={(event) => setFinalAddress(event.target.value)}
          placeholder="Enter final address"
          aria-invalid={isInvalid}
        />

        {isInvalid && <FieldError errors={[{ message: "Final address cannot be empty" }]} />}
      </Field>

      <DialogFooter showCloseButton>
        <Button type="submit" disabled={isPending} form="edit-final-address-form">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditFinalAddressDialog;
