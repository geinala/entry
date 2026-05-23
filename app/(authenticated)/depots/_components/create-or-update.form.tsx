"use client";

import { useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Item } from "@/app/_components/ui/item";
import { CreateOrUpdateDepotSchema, TCreateOrUpdateDepotSchema } from "@/schemas/depot.schema";
import { useForm } from "@tanstack/react-form";
import { TomTomMap, MapSearch, ClickMarker } from "@/app/_components/map";
import { Button } from "@/app/_components/ui/button";
import { TApiSuccessResponseWithData } from "@/types/response";
import { TDepot } from "@/types/database";

interface ICreateOrUpdateDepotFormProps {
  defaultValues?: TCreateOrUpdateDepotSchema;
  onSubmit: (data: TCreateOrUpdateDepotSchema) => Promise<TApiSuccessResponseWithData<TDepot>>;
  isLoading?: boolean;
}

export const CreateOrUpdateDepotForm = ({
  defaultValues,
  onSubmit,
  isLoading,
}: ICreateOrUpdateDepotFormProps) => {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CreateOrUpdateDepotSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const [selectedPosition, setSelectedPosition] = useState<{ lng: number; lat: number } | null>(
    defaultValues?.latitude && defaultValues?.longitude
      ? { lat: defaultValues.latitude, lng: defaultValues.longitude }
      : null,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-3 max-w-3xl mx-auto"
    >
      <form.Field
        name="name"
        /* eslint-disable react/no-children-prop */
        children={(field) => {
          const { isTouched, isValid, errors } = field.state.meta;

          const isInvalid = isTouched && !isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Depot Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter depot name"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={errors} />}
            </Field>
          );
        }}
      />

      <FieldGroup className="grid grid-cols-2">
        <form.Field
          name="latitude"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                  aria-invalid={isInvalid}
                  placeholder="Enter latitude"
                  autoComplete="off"
                  disabled
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="longitude"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                  aria-invalid={isInvalid}
                  placeholder="Enter longitude"
                  autoComplete="off"
                  disabled
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <form.Field
        name="address"
        children={(field) => {
          const { isTouched, isValid, errors } = field.state.meta;

          const isInvalid = isTouched && !isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Address</FieldLabel>
              <input
                id={field.name}
                name={field.name}
                type="hidden"
                value={field.state.value ?? ""}
                readOnly
              />
              <Item className="p-0 border-0 rounded-md mb-2">
                {field.state.value || "No location selected"}
              </Item>
              <Textarea
                id={`${field.name}-editable`}
                name={`${field.name}-editable`}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter depot address"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={errors} />}
            </Field>
          );
        }}
      />

      <div className="w-full h-72 border-secondary rounded-md border">
        <TomTomMap zoom={14} showTrafficFlow={true} showTrafficIncidents={true} style="monoLight">
          <div className="absolute top-2 left-2 z-10 w-60">
            <MapSearch
              placeholder="Search for depot location..."
              onSelect={(result) => {
                setSelectedPosition({ lat: result.lat, lng: result.lng });
                form.setFieldValue("latitude", result.lat);
                form.setFieldValue("longitude", result.lng);
                form.setFieldValue("address", result.address || "");
              }}
            />
          </div>
          <ClickMarker
            position={selectedPosition}
            onChange={(lngLat, nearestLocation) => {
              setSelectedPosition(lngLat);
              form.setFieldValue("latitude", lngLat.lat);
              form.setFieldValue("longitude", lngLat.lng);
              form.setFieldValue("address", nearestLocation?.address || "");
            }}
          />
        </TomTomMap>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {defaultValues ? "Update Depot" : "Create Depot"}
        </Button>
      </div>
    </form>
  );
};
