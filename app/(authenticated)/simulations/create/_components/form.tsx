"use client";

import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import DateTimeInput from "@/app/_components/ui/datetime-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useCreateSimulationJobMutations } from "../_hooks/use-mutations";
import DownloadTemplateButton from "@/app/(authenticated)/_components/download-template.button";
import { useGetDepotOptionsQuery } from "@/app/(authenticated)/depots/_hooks/use-queries";
import EmptyDepotDialog from "./empty-depot.dialog";
import { useCreateSimulationForm } from "../_hooks/use-form";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Label } from "@/app/_components/ui/label";

const CreateSimulationForm = () => {
  const { mutateAsync } = useCreateSimulationJobMutations();
  const { data: depotOptions = [], isLoading: isDepotOptionsLoading } = useGetDepotOptionsQuery();
  const [selectedDepotId, setSelectedDepotId] = useState<string | undefined>();
  const shouldPromptCreateDepot = !isDepotOptionsLoading && depotOptions.length === 0;

  const form = useCreateSimulationForm({
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  const handleDepotChange = (depotId: string) => {
    const depot = depotOptions.find((item) => item.id.toString() === depotId);

    setSelectedDepotId(depotId);

    form.setFieldValue("depotLatitude", depot?.latitude ?? 0);
    form.setFieldValue("depotLongitude", depot?.longitude ?? 0);
    form.setFieldValue("depotLocationAddress", depot?.address ?? "");
    form.setFieldValue("depotId", Number(depot?.id));
  };

  return (
    <>
      <EmptyDepotDialog open={shouldPromptCreateDepot} />

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
            <FieldGroup>
              <form.Field name="depotLocationAddress">
                {(field) => {
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
              </form.Field>

              <form.Field name="title">
                {(field) => {
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
              </form.Field>

              <form.Field name="startDatetime">
                {(field) => {
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
              </form.Field>

              <FieldGroup className="grid grid-cols-2">
                <form.Field name="congestionDelayThresholdInSeconds">
                  {(field) => (
                    <Field>
                      <FieldLabel>Congestion Delay Threshold (seconds)</FieldLabel>
                      <FieldDescription>
                        Minimum delay (seconds) before traffic is considered congestion.
                      </FieldDescription>
                      <Input
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.setValue(Number(e.target.value))}
                        className="w-full mt-auto"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="resequenceImprovementThresholdPercent">
                  {(field) => (
                    <Field>
                      <FieldLabel>Resequence Improvement Threshold (%)</FieldLabel>
                      <FieldDescription>
                        Minimum percentage improvement required before resequencing is applied.
                      </FieldDescription>
                      <Input
                        type="number"
                        step="0.1"
                        value={field.state.value}
                        onChange={(e) => field.setValue(Number(e.target.value))}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>

              <form.Field name="customersFile">
                {(field) => {
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

              <form.Field name="isWithAdaptiveParameters">
                {(field) => (
                  <Field>
                    <Label className="flex items-center gap-2">
                      <Checkbox
                        defaultChecked={field.state.value}
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.setValue(!!checked)}
                      />
                      Enable Adaptive Parameters
                    </Label>
                    <FieldDescription>
                      When enabled, the simulation will automatically adjust parameters based on
                      real-time node conditions.
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <div className="flex w-full items-center">
                <Button type="submit" className="ml-auto" form="create-simulation-job-form">
                  Next Step
                </Button>
              </div>
            </FieldGroup>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateSimulationForm;
