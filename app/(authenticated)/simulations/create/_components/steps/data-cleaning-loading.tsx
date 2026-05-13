import { TSimulationJob } from "@/types/database";
import ValidationStatus from "../validation-status";

interface DataCleaningLoadingProps {
  data: TSimulationJob | null;
}

export const DataCleaningLoading = ({ data }: DataCleaningLoadingProps) => {
  const isProcessing = data?.cleaningStatus === "in_progress";
  const isProcessed =
    data?.cleaningStatus === "completed" || data?.cleaningStatus === "needed_review";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ValidationStatus
        isFailed={false}
        isReuploading={false}
        isProcessing={isProcessing}
        progress={Number(data?.cleaningProgressPercentage ?? 0)}
        processedRows={Number(data?.cleaningProcessedRows ?? 0)}
        totalRows={Number(data?.fileTotalRows ?? 0)}
        isProcessed={isProcessed}
      />
    </div>
  );
};
