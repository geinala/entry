import { TSimulationJob } from "@/types/database";
import ValidationStatus from "../../validation-status";

interface DataValidationLoadingProps {
  data?: TSimulationJob | null;
}

export const DataValidationLoading = ({ data }: DataValidationLoadingProps) => {
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
        needsReview={needsReview}
      />
    </div>
  );
};
