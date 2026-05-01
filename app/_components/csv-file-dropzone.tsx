"use client";

import type { ComponentProps, FocusEventHandler } from "react";
import { useRef, useState } from "react";
import { CloudUpload, Trash } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { CSVPlaceholder } from "@/app/_components/csv-placeholder";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import { Input } from "@/app/_components/ui/input";
import { Item, ItemContent } from "@/app/_components/ui/item";
import { cn, truncateText } from "@/lib/utils";

interface CsvFileDropzoneProps extends ComponentProps<typeof Item> {
  inputId: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  accept?: string;
  description?: string;
  fileNameLength?: number;
  isInvalid?: boolean;
}

export const CsvFileDropzone = ({
  inputId,
  file,
  onFileChange,
  onRemove,
  onBlur,
  accept = ".csv,text/csv",
  description = "CSV file (max 10MB)",
  fileNameLength = 40,
  isInvalid = false,
  className,
  variant = "default",
  size = "default",
  ...props
}: CsvFileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const resetDragState = () => {
    dragCounterRef.current = 0;
    setIsDragging(false);
  };

  const handleFiles = (files: FileList | null) => {
    const nextFile = files?.[0] ?? null;

    if (nextFile) {
      onFileChange(nextFile);
    }
  };

  return (
    <Item
      {...props}
      variant={variant}
      size={size}
      data-dragging={isDragging}
      className={cn(
        "relative flex min-h-0 flex-col justify-center border-dashed transition-colors p-0",
        isDragging && "border-primary bg-primary/5",
        isInvalid && "border-destructive/60",
        className,
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();

        dragCounterRef.current += 1;
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isDragging) {
          setIsDragging(true);
        }
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();

        dragCounterRef.current = Math.max(dragCounterRef.current - 1, 0);

        if (dragCounterRef.current === 0) {
          setIsDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();

        handleFiles(event.dataTransfer.files);
        resetDragState();

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }}
    >
      <ItemContent className="relative flex h-full w-full flex-col justify-center">
        {!file ? (
          <label
            htmlFor={inputId}
            className="flex min-h-55 h-full w-full cursor-pointer flex-col items-center justify-center px-4 text-center"
          >
            <Empty className="p-1!">
              <EmptyContent className="gap-2">
                <CloudUpload className="text-muted-foreground h-7! w-7!" />
                <EmptyDescription className="flex flex-col text-center">
                  <span className="font-semibold text-primary">
                    {isDragging ? "Drop the CSV file here" : "Click to upload or drag and drop"}
                  </span>
                  {description}
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </label>
        ) : (
          <>
            <Button
              variant="ghost"
              id={`${inputId}-remove-file-button`}
              size="icon"
              type="button"
              className="absolute right-2 top-2 hover:bg-transparent"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
                resetDragState();

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
            <CSVPlaceholder
              fileName={truncateText(file.name.replace(/\.[^.]+$/, ""), fileNameLength)}
            />
          </>
        )}

        <Input
          ref={inputRef}
          id={inputId}
          name={inputId}
          onBlur={onBlur}
          onChange={(event) => {
            handleFiles(event.target.files);
          }}
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          type="file"
          hidden
          aria-invalid={isInvalid}
          autoComplete="off"
          accept={accept}
        />
      </ItemContent>
    </Item>
  );
};
