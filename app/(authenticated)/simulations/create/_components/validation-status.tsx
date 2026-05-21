import React from "react";
import Image from "next/image";
import { AlertCircle, AlertTriangle, ArrowUpRightIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { Progress } from "@/app/_components/ui/progress";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/_components/ui/empty";
import { toast } from "sonner";

type StatusCopy = {
  failedTitle: string;
  failedWithoutRowsDescription: string;
  reuploadLabel: string;
  reuploadingLabel: string;
  processingLabel: string;
  processedTitle: string;
  processedDescription: string;
  reviewTitle: string;
  reviewDescription: React.ReactNode;
};

type Props = {
  isFailed: boolean;
  isReuploading: boolean;
  onReupload?: () => void;
  isProcessing: boolean;
  progress: number;
  processedRows: number;
  totalRows: number;
  isProcessed: boolean;
  needsReview?: boolean;
  copy?: Partial<StatusCopy>;
  logo?: {
    src?: string;
    alt?: string;
  };
};

const defaultCopy: StatusCopy = {
  failedTitle: "Processing failed",
  failedWithoutRowsDescription:
    "The uploaded file could not be processed. Please re-upload a corrected file to continue.",
  reuploadLabel: "Re-upload File",
  reuploadingLabel: "Preparing re-upload...",
  processingLabel: "Processing data...",
  processedTitle: "Processing complete",
  processedDescription: "Preparing the next step...",
  reviewTitle: "You have failed rows",
  reviewDescription:
    "Please review the failed rows in the table below. You can choose to edit or delete them. Once all issues are resolved, you can continue to the next step.",
};

const ValidationStatus: React.FC<Props> = ({
  isFailed,
  isProcessing,
  progress,
  processedRows,
  totalRows,
  isProcessed,
  needsReview,
  copy,
  logo,
}) => {
  const mergedCopy: StatusCopy = {
    ...defaultCopy,
    ...copy,
  };

  const logoSrc = logo?.src ?? "/images/logo_4x.png";
  const logoAlt = logo?.alt ?? "Status";

  if (isFailed) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <AlertTriangle className="text-destructive" />
            </EmptyMedia>
            <EmptyTitle>{mergedCopy.failedTitle}</EmptyTitle>
            <EmptyDescription>{mergedCopy.failedWithoutRowsDescription}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => {
                toast.info("Creating a new simulation...");
              }}
            >
              Create New Simulation
            </Button>
          </EmptyContent>
          {/* <Link href="/file-requirements"> */}
          {/* TODO: Add link to guide */}
          <Button
            variant="link"
            className="text-muted-foreground"
            size="sm"
            onClick={() => {
              toast.info("File requirements guide is not available yet.");
            }}
          >
            Learn more about file requirements <ArrowUpRightIcon />
          </Button>
          {/* </Link> */}
        </Empty>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant={"default"}>
              <Image src={logoSrc} alt={logoAlt} width={50} height={50} />
            </EmptyMedia>
            <EmptyTitle>{mergedCopy.processingLabel}</EmptyTitle>
            <EmptyDescription>
              {processedRows} / {totalRows} rows processed
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Progress value={progress} className="w-full" />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (isProcessed) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant={"default"}>
              <Image src={logoSrc} alt={logoAlt} width={50} height={50} />
            </EmptyMedia>
            <EmptyTitle>{mergedCopy.processedTitle}</EmptyTitle>
            <EmptyDescription>{mergedCopy.processedDescription}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Progress value={100} className="w-full" />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (needsReview) {
    return (
      <div className="mb-3 w-full">
        <Alert variant={"destructive"} className="w-full">
          <AlertCircle />
          <AlertTitle>{mergedCopy.reviewTitle}</AlertTitle>
          <AlertDescription>{mergedCopy.reviewDescription}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};

export default ValidationStatus;
