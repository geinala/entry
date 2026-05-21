"use client";

import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import DateTimeInput from "@/app/_components/ui/datetime-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useForm } from "@tanstack/react-form";
import { CreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { formatDate } from "date-fns";
import { useCreateSimulationJobMutations } from "../_hooks/use-mutations";
import DownloadTemplateButton from "@/app/(authenticated)/_components/download-template.button";
import { useGetDepotOptionsQuery } from "@/app/(authenticated)/depots/_hooks/use-queries";

const CreateSimulationForm = () => {
  const { mutateAsync } = useCreateSimulationJobMutations();
  const { data: depotOptions = [], isLoading: isDepotOptionsLoading } = useGetDepotOptionsQuery();
  const [selectedDepotId, setSelectedDepotId] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      computationTimeLimit: 600,
      customersFile: null as unknown as File,
      depotLatitude: 0,
      depotLongitude: 0,
      depotLocationAddress: "",
      startDatetime: new Date().toISOString(),
      title: "Simulation Job - " + formatDate(new Date(), "yyyy-MM-dd"),
    },
    validators: {
      onSubmit: CreateSimulationJobSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        ...value,
        depotLatitude: Number(value.depotLatitude),
        depotLongitude: Number(value.depotLongitude),
        computationTimeLimit: Number(value.computationTimeLimit),
        depotId: Number(selectedDepotId),
      });
    },
  });

  const handleDepotChange = (depotId: string) => {
    const depot = depotOptions.find((item) => item.id.toString() === depotId);

    setSelectedDepotId(depotId);

    form.setFieldValue("depotLatitude", depot?.latitude ?? 0);
    form.setFieldValue("depotLongitude", depot?.longitude ?? 0);
    form.setFieldValue("depotLocationAddress", depot?.address ?? "");
  };

  return (
    <form
      id="create-simulation-job-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="w-full max-w-3xl mx-auto flex flex-col items-end gap-3"
    >
      <DownloadTemplateButton />
      <div className="w-full gap-3 min-h-0">
        <div className="flex-1 flex flex-col gap-2 h-full">
          <form.Field
            name="depotLocationAddress"
            /* eslint-disable react/no-children-prop */
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="depotId">Depot</FieldLabel>
                  <Select
                    value={selectedDepotId}
                    onValueChange={handleDepotChange}
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
          />
          <form.Field
            name="title"
            /* eslint-disable react/no-children-prop */
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Simulation Title</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder="Enter simulation title"
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="startDatetime"
            /* eslint-disable react/no-children-prop */
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>

                  <DateTimeInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(v: string) => field.setValue(v)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="computationTimeLimit"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Computation Time Limit (seconds)</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={300}
                    max={600}
                    value={field.state.value}
                    onChange={(e) => field.setValue(Number(e.target.value))}
                    placeholder="300 - 600"
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="customersFile"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedFile = field.state.value;

              return (
                <Field data-invalid={isInvalid} className="w-full h-full">
                  <FieldLabel htmlFor={field.name}>Customers Data</FieldLabel>
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
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
      </div>

      <div className="flex w-full items-center">
        <Button type="submit" className="ml-auto" form="create-simulation-job-form">
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default CreateSimulationForm;
