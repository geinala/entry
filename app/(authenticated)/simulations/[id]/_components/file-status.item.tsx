"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  File,
  FileExclamationPoint,
  FileInput,
  Hourglass,
  LucideIcon,
  XCircle,
} from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/app/_components/ui/item";
import { cn, truncateText } from "@/lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Progress } from "@/app/_components/ui/progress";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import CSVInput from "./input";
import { FileStatusSkeleton } from "./skeleton";
import { TSimulationWithUploadedFile } from "@/types/database";
import Link from "next/link";
import { useGetPresignedUrlQuery } from "@/app/_hooks/use-get-presigned-url";
import { Field, FieldLabel } from "@/app/_components/ui/field";

interface FileStatusItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  footer?: ReactNode;
  statusIcon?: ReactNode;
  variant: "primary" | "info" | "error" | "success";
  mediaBgClass?: string;
}

const VARIANT_CONFIG = {
  primary: {
    border: "border-primary",
    bg: "bg-primary/5",
    borderBg: "border-primary/5",
    iconColor: "text-primary",
  },
  success: {
    border: "border-green-600",
    bg: "bg-green-50",
    borderBg: "border-green-50",
    iconColor: "text-green-600",
  },
  info: {
    border: "border-blue-600",
    bg: "bg-blue-50",
    borderBg: "border-blue-50",
    iconColor: "text-blue-600",
  },
  error: {
    border: "border-red-600",
    bg: "bg-red-50",
    borderBg: "border-red-50",
    iconColor: "text-red-600",
  },
};

const FileStatusItem = ({
  icon: Icon,
  title,
  statusIcon: StatusIcon,
  description,
  footer,
  variant,
  mediaBgClass,
}: FileStatusItemProps) => {
  const config = VARIANT_CONFIG[variant];

  return (
    <Item variant={"outline"} className={config.border}>
      <ItemMedia variant={"icon"} className={cn(config.bg, config.borderBg, mediaBgClass)}>
        <Icon className={config.iconColor} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      {StatusIcon && <ItemMedia>{StatusIcon}</ItemMedia>}
      {footer && <ItemFooter>{footer}</ItemFooter>}
    </Item>
  );
};

const STATUS_ICON_VARIANT_CONFIG = {
  ready: {
    icon: CheckCircle,
    color: "text-green-600",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
  },
};

interface SimulationFileUploadedItemProps {
  data?: TSimulationWithUploadedFile;
  isLoading: boolean;
}

export const SimulationFileUploadedItem = ({
  data,
  isLoading,
}: SimulationFileUploadedItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: errorReportFileUrl, refetch } = useGetPresignedUrlQuery({
    objectName: data?.uploadedFile?.fileErrorPath ?? "",
    forceDownload: true,
  });

  const fileName = truncateText(data?.uploadedFile?.fileName ?? "Unknown File", 30);
  const totalRows = data?.uploadedFile?.totalRows;
  const processedRows = data?.uploadedFile?.processedRows;
  const status = data?.uploadedFile?.status;
  const description =
    status === "uploaded"
      ? "File uploaded successfully. Ready for validation."
      : `${totalRows} rows.`;
  const processingDescription = `File is validated successfully. ${totalRows} rows started processing.`;

  useEffect(() => {
    if (data?.uploadedFile?.status === "failed" && errorReportFileUrl?.data) {
      refetch();
    }
  }, [data?.uploadedFile?.status, errorReportFileUrl?.data, refetch]);

  const getStatusIcon = () => {
    if (!status || !STATUS_ICON_VARIANT_CONFIG[status as keyof typeof STATUS_ICON_VARIANT_CONFIG]) {
      return undefined;
    }
    const config = STATUS_ICON_VARIANT_CONFIG[status as keyof typeof STATUS_ICON_VARIANT_CONFIG];
    const Icon = config.icon;
    return <Icon className={config.color} />;
  };

  if (isLoading) {
    return <FileStatusSkeleton />;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {(status === "ready" || status === "uploaded" || status === "failed") && (
        <FileStatusItem
          icon={File}
          title={fileName}
          description={description}
          variant={status === "failed" ? "error" : "success"}
          statusIcon={getStatusIcon()}
        />
      )}

      {status === "processing" && (
        <FileStatusItem
          icon={File}
          title={fileName}
          description={processingDescription}
          variant="info"
        />
      )}

      {status === "validating" && (
        <FileStatusItem
          icon={Hourglass}
          title="Validating..."
          description={`${processedRows} of ${totalRows} rows processed`}
          footer={
            <Field>
              <FieldLabel htmlFor="progress-upload">
                <span>Validation progress</span>
                <span className="ml-auto">{data?.uploadedFile?.progressPercentage ?? 0}%</span>
              </FieldLabel>
              <Progress
                value={data?.uploadedFile?.progressPercentage ?? 0}
                indicatorClassName="bg-blue-500"
                className="bg-blue-500/20"
              />
            </Field>
          }
          variant="info"
        />
      )}

      {status === "failed" && (
        <FileStatusItem
          icon={FileExclamationPoint}
          title="Validation Failed"
          description="Please check the file format and content."
          footer={
            <div className="flex flex-col w-full">
              {errorReportFileUrl?.data && (
                <Link href={errorReportFileUrl?.data} download target="_self">
                  <Button variant={"destructive"} className="w-full">
                    Download Error Report
                  </Button>
                </Link>
              )}
              <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full mt-2">
                  Re-upload File
                </Button>
              </DialogTrigger>
            </div>
          }
          variant="error"
        />
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-1 items-center">
            <FileInput />
            Re-upload File
          </DialogTitle>
          <Alert className="border-amber-500 bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Re-uploading the file will overwrite the existing data. Please make sure to keep a
              backup if necessary.
            </AlertDescription>
          </Alert>
        </DialogHeader>
        <CSVInput
          className="py-10! [&_#remove-file-button]:hidden"
          onFileUpload={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
