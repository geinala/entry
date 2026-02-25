"use client";

import { Button } from "@/app/_components/ui/button";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import { CSVPlaceholder } from "@/app/_components/csv-placeholder";
import { CSVUploadedSchema } from "@/schemas/file.schema";
import { useForm } from "@tanstack/react-form";
import { CloudUpload, Trash } from "lucide-react";
import { useUploadCSVMutation } from "../_hooks/use-mutations";
import { useState } from "react";
import { Item, ItemContent } from "@/app/_components/ui/item";
import { truncateText } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { useParams } from "next/navigation";

export default function CSVInput() {
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
      <Item
        variant={"muted"}
        className="border border-neutral-400 border-dashed flex items-center rounded-md flex-col justify-center text-center cursor-pointer hover:bg-gray-50 bg-muted"
      >
        <ItemContent>
          {!selectedFile ? (
            /* eslint-disable react/no-children-prop */
            <form.Field
              name="file"
              children={(field) => {
                const { isTouched, isValid } = field.state.meta;

                const isInvalid = isTouched && !isValid;

                return (
                  <>
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Empty className="p-1!">
                          <EmptyContent className="gap-2">
                            <CloudUpload className="text-muted-foreground w-7! h-7!" />
                            <EmptyDescription className="leading-5">
                              <span className="text-primary font-semibold">Click to upload</span>{" "}
                              CSV file {"(max 10MB)"}
                            </EmptyDescription>
                          </EmptyContent>
                        </Empty>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          setSelectedFile(file);
                          field.handleChange(file);
                        }}
                        max={1}
                        type="file"
                        hidden
                        aria-invalid={isInvalid}
                        placeholder="Enter simulation title"
                        autoComplete="off"
                        accept=".csv"
                        min={1}
                      />
                    </Field>
                  </>
                );
              }}
            />
          ) : (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                type="button"
                className="absolute top-4 right-4 hover:bg-transparent"
                onClick={() => {
                  setSelectedFile(null);
                  form.setFieldValue("file", null);
                }}
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
              <CSVPlaceholder
                fileName={`${truncateText(selectedFile.name.split(".").slice(0, -1).join("."), 40)}`}
              />
            </>
          )}
        </ItemContent>
      </Item>

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
