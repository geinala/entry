import { TSimulationJob } from "@/types/database";
import ValidationStatus from "../../validation-status";

interface ManualCorrectionLoadingProps {
  data?: TSimulationJob | null;
}

export const ManualCorrectionLoading = ({ data }: ManualCorrectionLoadingProps) => {
  const isProcessing = data?.geocodingStatus === "in_progress";
  const isProcessed = data?.geocodingStatus === "completed";
  const needsReview = data?.geocodingStatus === "needed_review";

  return (
    <div className={`flex flex-col items-center justify-center w-full ${!needsReview && "h-full"}`}>
      <ValidationStatus
        isFailed={false}
        isReuploading={false}
        isProcessing={isProcessing}
        progress={Number(data?.geocodingProgressPercentage)}
        processedRows={Number(data?.geocodingProcessedRows)}
        totalRows={Number(data?.fileTotalRows)}
        isProcessed={isProcessed}
        needsReview={needsReview}
      />
    </div>
  );
};
