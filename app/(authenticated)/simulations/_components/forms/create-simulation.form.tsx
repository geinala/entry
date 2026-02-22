"use client";

import { Button } from "@/app/_components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { CreateSimulationSchema } from "@/schemas/simulation.schema";
import { useForm } from "@tanstack/react-form";
import { useCreateSimulationMutation } from "../../_hooks/use-mutations";

interface CreateSimulationFormDialogProps {
  onSuccess?: () => void;
}

export const CreateSimulationFormDialog = ({ onSuccess }: CreateSimulationFormDialogProps) => {
  const { mutateAsync, isPending } = useCreateSimulationMutation();

  const form = useForm({
    defaultValues: {
      title: "",
    },
    validators: { onSubmit: CreateSimulationSchema },
    onSubmit: async (values) => {
      await mutateAsync(values.value);
      onSuccess?.();
    },
  });

  return (
    <form
      id="create-simulation-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Simulation</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new simulation.
          </DialogDescription>
        </DialogHeader>
        {/* eslint-disable react/no-children-prop */}
        <form.Field
          name="title"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter simulation title"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
        <DialogFooter>
          <Button
            type="submit"
            form="create-simulation-form"
            isLoading={isPending || form.state.isSubmitting}
            disabled={isPending || form.state.isSubmitting}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
};
