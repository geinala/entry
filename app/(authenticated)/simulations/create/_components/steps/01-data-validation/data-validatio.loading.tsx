import { TSimulationJob } from "@/types/database";
import ValidationStatus from "../../validation-status";

interface DataValidationLoadingProps {
  data?: TSimulationJob | null;
  errorRowsCount?: number;
}

export const DataValidationLoading = ({ data, errorRowsCount }: DataValidationLoadingProps) => {
  const isProcessing =
    data?.fileValidationStatus === "validating" || data?.fileValidationStatus === "uploaded";
  const isProcessed = data?.fileValidationStatus === "completed";
  const needsReview = data?.fileValidationStatus === "needed_review";

  return (
    <div className={`flex flex-col items-center justify-center w-full ${!needsReview && "h-full"}`}>
      <ValidationStatus
        isFailed={false}
        isReuploading={false}
        isProcessing={isProcessing}
        progress={Number(data?.fileProgressPercentage)}
        processedRows={Number(data?.fileProcessedRows)}
        totalRows={Number(data?.fileTotalRows)}
        isProcessed={isProcessed}
        needsReview={needsReview && errorRowsCount !== undefined ? errorRowsCount > 0 : false}
      />
    </div>
  );
};
