"use client";

import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { CsvFileDropzone } from "@/app/_components/csv-file-dropzone";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { ClickMarker, MapSearch, TomTomMap } from "@/app/_components/map";
import DateTimeInput from "@/app/_components/ui/datetime-input";
import { Item } from "@/app/_components/ui/item";
import { useForm } from "@tanstack/react-form";
import { CreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { formatDate } from "date-fns";
import { useCreateSimulationJobMutations } from "../_hooks/use-mutations";
import DownloadTemplateButton from "@/app/(authenticated)/_components/download-template.button";

const CreateSimulationForm = () => {
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
      });
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [selectedPosition, setSelectedPosition] = useState<{ lng: number; lat: number } | null>(
    null,
  );
  const { mutateAsync } = useCreateSimulationJobMutations();

  return (
    <form
      id="create-simulation-job-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="w-full flex flex-col items-end gap-3"
    >
      <DownloadTemplateButton />
      <div className="grid grid-cols-2 items-stretch w-full gap-3 min-h-0">
        <div className="flex-1 flex flex-col gap-2 h-full">
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
            name="depotLocationAddress"
            children={(field) => {
              const isInvalid = field.state.meta.errors.length > 0;

              return (
                <Field className="mt-3" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Depot Location</FieldLabel>
                  <input
                    id={field.name}
                    name={field.name}
                    type="hidden"
                    value={field.state.value}
                    readOnly
                  />
                  <Item className="p-0 border-0 rounded-md mb-2">
                    {field.state.value || "No location selected"}
                  </Item>
                  <div className="w-full h-80 border-secondary rounded-md border">
                    <TomTomMap
                      zoom={14}
                      showTrafficFlow={true}
                      showTrafficIncidents={true}
                      style="monoLight"
                    >
                      <div className="absolute top-2 left-2 z-10 w-60">
                        <MapSearch
                          placeholder="Search for depot location..."
                          onSelect={(result) => {
                            setSelectedPosition({ lat: result.lat, lng: result.lng });
                            form.setFieldValue("depotLatitude", result.lat);
                            form.setFieldValue("depotLongitude", result.lng);
                            field.handleChange(result.address || "");
                            field.handleBlur();
                          }}
                        />
                        <ClickMarker
                          position={selectedPosition}
                          onChange={(lngLat, nearestLocation) => {
                            setSelectedPosition(lngLat);
                            form.setFieldValue("depotLatitude", lngLat.lat);
                            form.setFieldValue("depotLongitude", lngLat.lng);
                            field.handleChange(nearestLocation?.address || "");
                            field.handleBlur();
                          }}
                        />
                      </div>
                    </TomTomMap>
                  </div>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 min-h-0">
          <Label htmlFor="customersFile">Customers CSV File</Label>
          {/* eslint-disable react/no-children-prop */}
          <form.Field
            name="customersFile"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid} className="w-full h-full">
                  <CsvFileDropzone
                    inputId={field.name}
                    file={selectedFile as File}
                    onFileChange={(file) => {
                      setSelectedFile(file);
                      field.setValue(file as File);
                    }}
                    onRemove={() => {
                      setSelectedFile(null);
                      field.setValue(null as unknown as File);
                    }}
                    onBlur={field.handleBlur}
                    isInvalid={isInvalid}
                    variant="default"
                    className="flex flex-1 min-h-0 border-neutral-400 bg-gray-100 hover:bg-gray-50"
                  />
                </Field>
              );
            }}
          />

          <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(error) => (error ? <FieldError errors={error.customersFile} /> : null)}
          </form.Subscribe>
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
