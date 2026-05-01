"use client";

import { Button } from "@/app/_components/ui/button";
import { CSVUploadedSchema } from "@/schemas/file.schema";
import { useForm } from "@tanstack/react-form";
import { useUploadCSVMutation } from "../_hooks/use-mutations";
import React, { useState } from "react";
import { Field, FieldError } from "@/app/_components/ui/field";
import { useParams } from "next/navigation";
import { CsvFileDropzone } from "@/app/_components/csv-file-dropzone";
import { cn } from "@/lib/utils";

interface CSVInputProps extends React.ComponentProps<typeof CsvFileDropzone> {
  onFileUpload?: () => void;
}

export default function CSVInput({ onFileUpload, ...props }: CSVInputProps) {
  const { id: simulationId } = useParams<{ id: string }>();
  const { mutateAsync, isPending } = useUploadCSVMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      file: null as File | null,
    },
    validators: {
      onSubmit: CSVUploadedSchema,
    },
    onSubmit: async (values) => {
      if (values.value.file) {
        await onSubmit(values.value.file);
      }
      if (onFileUpload) {
        onFileUpload();
      }
    },
  });

  const onSubmit = async (file: File) => {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    try {
      await mutateAsync({ formData, simulationId });
      form.setFieldValue("file", null);
    } catch {
      form.setFieldValue("file", null);
    } finally {
      setSelectedFile(null);
    }
  };

  return (
    <form
      id="form-csv-input"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* eslint-disable react/no-children-prop */}
      <form.Field
        name="file"
        children={(field) => {
          const { isTouched, isValid } = field.state.meta;

          const isInvalid = isTouched && !isValid;

          return (
            <Field data-invalid={isInvalid}>
              <CsvFileDropzone
                {...props}
                inputId={field.name}
                file={selectedFile}
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
                variant={props.variant ?? "muted"}
                    className={cn(
                      "border border-neutral-400 border-dashed flex items-center rounded-md flex-col justify-center text-center cursor-pointer hover:bg-gray-50 bg-muted",
                      props.className,
                    )}
              />
            </Field>
          );
        }}
      />

      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(error) => (error ? <FieldError errors={error.file} /> : null)}
      </form.Subscribe>

      <Button
        type="submit"
        className="mt-4 w-full"
        form="form-csv-input"
        disabled={isPending || form.state.isSubmitting || !selectedFile}
        isLoading={isPending || form.state.isSubmitting}
      >
        Upload
      </Button>
    </form>
  );
}
