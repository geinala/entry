"use client";

import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/app/_components/ui/button";
import { TApiSuccessResponseWithData } from "@/types/response";
import { CreateParameterSchema, TCreateParameterSchema } from "@/schemas/parameter.schema";
import { TTuningExperimentDataset } from "@/types/database";
import { useGetDepotOptionsQuery } from "../../depots/_hooks/use-queries";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface ICreateParameterFormProps {
  defaultValues?: TCreateParameterSchema;
  onSubmit: (
    data: TCreateParameterSchema,
  ) => Promise<TApiSuccessResponseWithData<TTuningExperimentDataset>>;
  isLoading?: boolean;
}

export const CreateParameterForm = ({
  defaultValues,
  onSubmit,
  isLoading,
}: ICreateParameterFormProps) => {
  const { data: depotOptions = [], isLoading: isDepotOptionsLoading } = useGetDepotOptionsQuery();
  const [selectedDepotId, setSelectedDepotId] = useState<number | undefined>();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CreateParameterSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-3 max-w-3xl mx-auto"
    >
      <form.Field name="depotId">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="depotId">Depot</FieldLabel>
              <Select
                value={selectedDepotId?.toString() || ""}
                onValueChange={(value) => {
                  const depotId = Number(value);
                  setSelectedDepotId(depotId);
                  field.setValue(depotId);
                }}
                aria-invalid={isInvalid}
                disabled={isDepotOptionsLoading || depotOptions.length === 0}
              >
                <SelectTrigger id="depotId" className="w-full">
                  <SelectValue placeholder="Select a depot" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {depotOptions.map((depot) => (
                    <SelectItem key={depot.id} value={depot.id.toString()}>
                      {depot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="dataset">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          const selectedFile = field.state.value;

          return (
            <Field data-invalid={isInvalid} className="w-full h-full">
              <FieldLabel htmlFor={field.name}>Dataset</FieldLabel>
              <div className="flex items-center gap-3 rounded-md border border-dashed p-3">
                <Input
                  id={field.name}
                  name={field.name}
                  type="file"
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  accept=".csv,text/csv"
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.setValue((event.target.files?.[0] ?? null) as unknown as File);
                  }}
                  className="max-w-xs"
                />

                <div className="min-w-0 flex-1 text-sm text-muted-foreground">
                  {selectedFile ? (
                    <span className="block truncate">{selectedFile.name}</span>
                  ) : (
                    <span>No file selected</span>
                  )}
                </div>

                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => field.setValue(null as unknown as File)}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {defaultValues ? "Update Depot" : "Create Depot"}
        </Button>
      </div>
    </form>
  );
};
